/**
 * Consulta resumen de opciones entre dos fechas
 */
set @start_time = 0;
set @end_time = 2586315580;
set @query_general_conditions = AND options.expiration_time BETWEEN @start_time AND @end_time;

/*
AND options.is_demo = 1
AND options.is_demo = -1
 */

select 
	sum(options.amount) as total_inversion, 
	sum(options.profit_value) as global_performance, 
	clients.total as total_clients,
	count(options.id) as number_operations_clients,
	traders.number_operations_traders,
	successful_operations.successful_operations,
	failed_operations.failed_operations,
	neutral_operations.neutral_operations
from options 
, (
	select 
		count(*) as number_operations_traders
	from options where options.user_id IS NOT NULL @query_general_conditions
) traders,
(
	select 
		count(*) as successful_operations
	from options where options.result = 1 @query_general_conditions
) successful_operations,
(
	select 
		count(*) as failed_operations
	from options where options.result = -1 @query_general_conditions
) failed_operations,
(
	select 
		count(*) as neutral_operations
	from options where options.result = 0 @query_general_conditions
) neutral_operations,
(
	select count(*) as total from (
		SELECT users_start_trading.user_id from options 
		join users_start_trading on users_start_trading.id = options.user_start_trading_id
		where user_start_trading_id is not null @query_general_conditions GROUP BY users_start_trading.user_id
	) q

) clients

where options.user_start_trading_id IS NOT NULL 
@query_general_conditions


/***************
Informacion de cada operacion de un trader
*************/
SELECT 
	opt_trader.id, 
	opt_trader.active_name,
    from_unixtime(opt_trader.expiration_time) as expired,
    opt_trader.direction, 
    opt_trader.user_id as trader_id,
    (
		SELECT 
		    sum(opt_1.amount)
		FROM options as opt_1
		WHERE opt_1.parent_option_id = opt_trader.id /*AND opt_1.is_demo = -1*/
	) as full_amount,
    (
		SELECT 
		    sum(opt_1.profit_value)
		FROM options as opt_1
		WHERE opt_1.parent_option_id = opt_trader.id /*AND opt_1.is_demo = -1*/
	) as full_profit,
    (
		SELECT 
		    count(*)
		FROM options as opt_1
		WHERE opt_1.parent_option_id = opt_trader.id /*AND opt_1.is_demo = -1*/
	) as full_clients,
    (
		SELECT 
		    count(*)
		FROM options as opt_1
		WHERE opt_1.parent_option_id = opt_trader.id /*AND opt_1.is_demo = -1*/ AND result = 1
	) as winners,
    (
		SELECT 
		    count(*)
		FROM options as opt_1
		WHERE opt_1.parent_option_id = opt_trader.id /*AND opt_1.is_demo = -1*/ AND result = -1
	) as losers,
    (
		SELECT 
		    count(*)
		FROM options as opt_1
		WHERE opt_1.parent_option_id = opt_trader.id AND opt_1.is_demo = -1 AND result = 0
	) as neutral

FROM options as opt_trader
WHERE opt_trader.is_demo IS NULL AND opt_trader.user_id IS NOT NULL;



/**
 * Consulta de resultados de cada usuario
 */
select * from (
select 
	users.id,
	users.name,
	(SELECT sum(options.profit_value) as performance FROM options
	INNER JOIN users_start_trading ON options.user_start_trading_id = users_start_trading.id
	WHERE users_start_trading.user_id = users.id AND is_demo = -1
	) as performance,
	(SELECT count(options.id) FROM options
	INNER JOIN users_start_trading ON options.user_start_trading_id = users_start_trading.id
	WHERE users_start_trading.user_id = users.id AND is_demo = -1) as operations,
	(SELECT count(options.id) FROM options
	INNER JOIN users_start_trading ON options.user_start_trading_id = users_start_trading.id
	WHERE users_start_trading.user_id = users.id AND is_demo = -1
	AND options.result = 1) as win,
	(SELECT count(options.id) FROM options
	INNER JOIN users_start_trading ON options.user_start_trading_id = users_start_trading.id
	WHERE users_start_trading.user_id = users.id AND is_demo = -1
	AND options.result = -1) as lose,
	(SELECT count(options.id) FROM options
	INNER JOIN users_start_trading ON options.user_start_trading_id = users_start_trading.id
	WHERE users_start_trading.user_id = users.id AND is_demo = -1
	AND options.result = 0) as equal,
	(SELECT from_unixtime(options.expiration_time - 36000) FROM options
	INNER JOIN users_start_trading ON options.user_start_trading_id = users_start_trading.id
	WHERE users_start_trading.user_id = users.id AND is_demo = -1
	ORDER BY options.id DESC LIMIT 1) as last
FROM users
) u WHERE u.operations > 0;



/*
Operaciones de un usuario
 */
SELECT 
	options.id,
	options.active_name,
	from_unixtime(options.expiration_time - 36000) as expired,
	options.amount,
	options.profit_percentage,
	options.profit_value,
	options.result,
	options.is_demo
FROM options
INNER JOIN users_start_trading ON options.user_start_trading_id = users_start_trading.id
INNER JOIN users ON users_start_trading.user_id = users.id
WHERE users.id = 137;


/**
 * Datos de usuarios
 */
select id, name, cell_phone_number, email, ssid, DATE_SUB(created_at, INTERVAL 5 HOUR) as created_at, DATE_SUB(updated_at, INTERVAL 5 HOUR) as updated_at from users;


/**
 * Información de la configuración de los usuarios
 */
select 
	p.id,
	u.name,
	u.ssid,
	p.is_active,
	p.use_practice_account,
	p.amount,
	p.current_balance,
	p.operations,
	p.stop_loss,
	p.stop_loss_value,
	p.allow_increment,
	p.activation_date,
	p.user_id 
from product_settings p 
inner join users u on p.user_id = u.id WHERE u.ssid IS NOT NULL;



/**
 * Consulta las operaciones y los resultados obtenidos
 */
SELECT
	o.id,
	from_unixtime(o.expiration_time - 36000) as expired,
	o.active_name,
	o.direction,
	(
		SELECT count(op.id) FROM options op WHERE parent_option_id = o.id AND result = 1
	) win,
	(
		SELECT count(op.id) FROM options op WHERE parent_option_id = o.id AND result = -1
	) lose,
	(
		SELECT count(op.id) FROM options op WHERE parent_option_id = o.id AND result = 0
	) equal
FROM options o WHERE o.user_id IS NOT NULL ORDER BY o.id DESC LIMIT 1;

/**
 * Consulta las copias realizadas de una operacion
 */
SELECT result, amount, profit_percentage, profit_value, is_demo FROM options WHERE parent_option_id = 12


/**
 * Restablece los valores de las operaciones de los usuarios
 */
UPDATE product_settings
SET operations = 0, current_balance = 0, higher_balance = 0, activation_date = null
