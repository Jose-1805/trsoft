import React from 'react';

import { connect } from 'react-redux';
import { actSortTableJL1805 } from '../../../../redux/tableJL1805/actions';

import { Table } from 'semantic-ui-react';

const Headers = ({ config, handleSort, headers }) => {
	const { sortable, column, direction } = config;

	//se establecen los encabezados de acuerdo a la configuración
	let items_header = headers.map((el, i) => {
		return <Table.HeaderCell 
		sorted={el.no_sortable?null:sortable?(column === el.name ? direction : null):null}
		onClick={el.no_sortable?null:sortable?handleSort(el.name):null}
		key={el.name}
		>
			{el.label}
		</Table.HeaderCell>
	})

	return <Table.Header>
		      <Table.Row>
					{items_header}	      	
		      </Table.Row>
		    </Table.Header>
}

const mapStateToProps = (state, {id_table}) => {
	return {
		config:state.tableJl1805.config_tables[id_table],
		headers:state.tableJl1805.config_tables[id_table].headers
	};
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		handleSort:clicked_column => () => {
			dispatch(actSortTableJL1805(props.id_table, clicked_column))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Headers);