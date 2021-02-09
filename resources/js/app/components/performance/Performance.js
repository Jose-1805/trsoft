import React, { Component, PropTypes } from 'react';
import { Segment, Statistic, Grid, Image, Button, Icon, Checkbox, Popup, Header, Divider } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import params from '../../config/params';

import { TableJL1805, Btn, DateFunc } from '../helpers/Helpers';
import { actInitTableJL1805, actUpdateHeadersTableJL1805, actUpdateOtherParamsTableJL1805 } from '../../redux/tableJL1805/actions';
import { Valid } from '../helpers/Helpers';
import { connect } from 'react-redux';

const id_table = 'table_performance';

const getDateFormat = (date) => {
    let month = (date.getMonth() +  1);
    month = month > 9?month:'0'+month;

    let date_ = date.getDate();
    date_ = date_ > 9?date_:'0'+date_;

    let hour = date.getHours();
    hour = hour > 9?hour:'0'+hour;

    let minute = date.getMinutes();
    minute = minute > 9?minute:'0'+minute;

    return date.getFullYear()+'-'+month+'-'+date_+'T'+hour+':'+minute;
}

class Performance extends Component {
    constructor(props) {
        super(props);

        let date = new Date();
        //date.setMonth(date.getMonth() - 1);
        date.setMonth(4);
        date.setDate(1);
        date.setFullYear(2020);

        let max_date = new Date();
        max_date.setHours(23);
        max_date.setMinutes(59);

        this.state = {
            current_lang:props.i18n.language,
            max_date:getDateFormat(max_date),
            end_date:getDateFormat(new Date),
            start_date:getDateFormat(date),
            demo:false,
            open_popup:false
        }

        this.getHeaders = this.getHeaders.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.toggleDemo = this.toggleDemo.bind(this);
        this.updateParamsTable = this.updateParamsTable.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            //Se pasan las fechas a utc
            let start_date = new Date(this.state.start_date);
            let end_date = new Date(this.state.end_date);

            let config_table = {
                rows:[5, 10, 50, 100],
                rows_current:10,
                current_page:1,//Página actual de la paginación
                search:false,//Muestra o no el buscador
                load_search:false,//Muestra el buscador cargando o no
                search_value:'',
                pagination:true,//Muestra o no la paginacion
                sortable:true,//si contiene columnas ordenables
                column:'expiration_time',//columna por la cual se está ordenando
                direction:'descending',//direccion de ordenamiento
                full_data_length:0,//cantidad total de datos que existen
                data_source:'server',//determina donde se almacena la información
                                    //puede ser local o server
                data_source_url:params.URL_API+'performance/list',//Si el item data_source es server
                                                //este item determina donde se encuentra el recurso
                data_aux:[],//datos utilizados para filtrar los items de data y no perder la información
                           //Sólo se utiliza cuando data_source es igual 'local'
                data_readonly:[],//una copia de los datos que se puede ordenar pero no quitar ni agregar items
                data:[],
                load_table:false,
                //función que se ejecuta cuando se asigna el valor a una celda
                //se utiliza cuando se desea personalizar el valor en una celda
                assignValueCell:(header, row, value) => {
                    if(header.name == 'active_image'){
                        return <Image src={row.active_image} size='mini'/>
                    }else if(header.name == 'amount' || header.name == 'profit_value'){
                        return  '$ '+(typeof value == 'number'?value:0);
                    }else if(header.name == 'profit_percentage'){
                        return value+'%';
                    }else if(header.name == 'direction'){
                        return this.props.t('performance.'+(value == 1?'call':'put'))
                    }/*else if(header.name == 'is_demo'){
                        return this.props.t('performance.'+(value == 1?'yes':'no'))
                    }*/else if(header.name == 'expiration_time'){
                        let date = new Date(parseInt(value.toString()+"000"));
                        //return date.toLocaleString();
                        return DateFunc.dateCurrentTimeZone(parseInt(value.toString()+"000")).toLocaleString();
                    }
                    return value;
                },
                //función que se ejecuta cuando se dibuja cada celda
                //se utiliza cuando se desea personalizar la una celda en especifico
                assignCell:(header, rowData, CellComponent, index) => {
                    return <CellComponent key={index}/>;
                },
                //función que se ejecuta cuando se dibuja cada fila
                //se utiliza cuando se desea personalizar la fila completa
                assignRow:(rowData, RowComponent, index) => {
                    return <RowComponent key={index} positive={rowData.profit_value > 0?true:false} negative={rowData.profit_value < 0?true:false} disabled={rowData.profit_value == 0 || rowData.profit_value == null?true:false}/>;
                },
                props:{textAlign:'center'},
                otherParams:{
                    demo:this.state.demo,
                    start_date:new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate(), start_date.getUTCHours(), start_date.getUTCMinutes(), start_date.getUTCSeconds()).getTime().toString().substr(0,10),
                    end_date:new Date(end_date.getUTCFullYear(), end_date.getUTCMonth(), end_date.getUTCDate(), end_date.getUTCHours(), end_date.getUTCMinutes(), end_date.getUTCSeconds()).getTime().toString().substr(0,10)
                },
            }


            /*config_table.assignRow = (rowData, RowComponent, index) => {
                return <RowComponent key={index} negative={(rowData.age == '27 años' || rowData.age == '9 años')?true:false} positive={(rowData.age == '25 años')?true:false}/>;
            };*/

            config_table.headers = this.getHeaders();

            this.props.initTable(id_table, config_table);
        }, 20)
    }

    componentDidUpdate(nextProps) {
        //Hay actualización de idioma
        if(this.state.current_lang != nextProps.i18n.language){
            this.setState({current_lang:nextProps.i18n.language}, () => {
                this.props.updateHeadersTable(id_table, this.getHeaders());
            });
        }
    }

    updateParamsTable(){
        //Se pasan las fechas a utc
        let start_date = new Date(this.state.start_date);
        let end_date = new Date(this.state.end_date);
        this.props.updateParamsTable(id_table, {
            demo:this.state.demo,
            start_date:new Date(start_date.getUTCFullYear(), start_date.getUTCMonth(), start_date.getUTCDate(), start_date.getUTCHours(), start_date.getUTCMinutes(), start_date.getUTCSeconds()).getTime().toString().substr(0,10),
            end_date:new Date(end_date.getUTCFullYear(), end_date.getUTCMonth(), end_date.getUTCDate(), end_date.getUTCHours(), end_date.getUTCMinutes(), end_date.getUTCSeconds()).getTime().toString().substr(0,10)
        });
    }

    onChangeDate(e){
        const { name, value } = e.target;
        this.setState({[name]:value});
    }

    toggleDemo(){
        this.setState((old_state) => {
            return {
                demo:!old_state.demo
            }
        }, this.updateParamsTable)
    }

    getHeaders(){
        return [
            {name:'active_image',label:''},
            {name:'active_name',label:this.props.t('performance.active_label')},
            {name:'amount',label:this.props.t('performance.amount_label')},
            {name:'profit_percentage',label:this.props.t('performance.profit_percentage_label')},
            {name:'profit_value',label:this.props.t('performance.profit_value_label')},
            {name:'expiration_time',label:this.props.t('performance.expiration_time_label')},
            {name:'direction',label:this.props.t('performance.direction_label')},
            //{name:'is_demo',label:this.props.t('performance.is_demo_label')},
        ];
    }

    render() {
        const { start_date, end_date, max_date, open_popup, demo } = this.state;
       
        let performance_value = (this.props.config_table && 'more' in this.props.config_table)?this.props.config_table.more.performance:0;
       
        let equal = (this.props.config_table && 'more' in this.props.config_table)?this.props.config_table.more.equal:0;
       
        let success_rate = (this.props.config_table && 'more' in this.props.config_table)?(
                this.props.config_table.more.success != 0?
                (this.props.config_table.more.success * 100)/(this.props.config_table.full_data_length - equal)
                :0
            ):0;

        if(performance_value % 1 != 0)
            performance_value = performance_value.toFixed(2);

        if(success_rate % 1 != 0)
            success_rate = success_rate.toFixed(2);

        return (
            <Segment basic textAlign='center' className='p-1'>
                <Header as='h1'>{this.props.t('performance.title_'+(demo?'demo':'real'))}</Header>
                <Divider className='divider-color-app m-b-1'/>
                <Segment basic className='p-0'>

                    <Segment className='p-2'>
                        <Grid verticalAlign='middle' divided>
                            <Grid.Row>
                                <Grid.Column computer={10} mobile={16} textAlign='center'>
                                    <Grid centered>
                                        <Segment basic textAlign='center'>
                                            <Statistic.Group size="small">                    
                                                <Statistic color="grey">
                                                    <Statistic.Value>{this.props.config_table?(this.props.config_table.full_data_length - equal):0}</Statistic.Value>
                                                    <Statistic.Label>{this.props.t('performance.operations')}</Statistic.Label>
                                                </Statistic>
                                                <Statistic color='blue'>
                                                    <Statistic.Value>{success_rate}%</Statistic.Value>
                                                    <Statistic.Label>{this.props.t('performance.success_rate')}</Statistic.Label>
                                                </Statistic>
                                                <Statistic color={performance_value > 0?'green':(performance_value == 0?'grey':'red')}>
                                                    <Statistic.Value>$ {performance_value}</Statistic.Value>
                                                    <Statistic.Label>{this.props.t('performance.performance')}</Statistic.Label>
                                                </Statistic>
                                            </Statistic.Group>
                                        </Segment>
                                    </Grid>
                                </Grid.Column>

                                <Grid.Column computer={6} mobile={16}>
                                    <Checkbox toggle label={this.props.t('performance.is_demo_label')} checked={demo} onChange={this.toggleDemo}/>

                                    <Popup basic flowing inverted open={open_popup}
                                        trigger={
                                            <Btn.Filters 
                                                className='m-l-2'
                                                onClick={() => {
                                                    this.setState((old_state) => ({
                                                        open_popup:!old_state.open_popup
                                                    }));
                                                }}
                                            />
                                        }
                                    >

                                        <Grid centered divided columns={2}>
                                            <Grid.Column textAlign='center'>
                                                <Header as='h4'>{this.props.t('performance.start_date')}</Header>
                                                <Valid.Input type='datetime-local' max={max_date} name='start_date' value={start_date} onChange={this.onChangeDate}/>
                                            </Grid.Column>
                                            <Grid.Column textAlign='center'>                                            
                                                <Header as='h4'>{this.props.t('performance.end_date')}</Header>
                                                <Valid.Input type='datetime-local' max={max_date} name='end_date' value={end_date} onChange={this.onChangeDate}/>
                                            </Grid.Column>
                                        </Grid>
                                        <Btn.Accept floated='right' onClick={() => {
                                            this.setState({open_popup:false});
                                            this.updateParamsTable();
                                        }}/>
                                        <Btn.Close floated='right' onClick={() => this.setState({open_popup:false})}/>
                                    </Popup>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Segment>
                <TableJL1805 id={id_table}/>
            </Segment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        config_table: state.tableJl1805.config_tables[id_table]
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        initTable:(id, config) => {
            dispatch(actInitTableJL1805(id, config))
        },
        updateHeadersTable:(id, headers) => {
            dispatch(actUpdateHeadersTableJL1805(id, headers))
        },
        updateParamsTable:(id, params) => {
            dispatch(actUpdateOtherParamsTableJL1805(id, params))
        },
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Performance));
