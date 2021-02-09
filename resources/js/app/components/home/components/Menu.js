import React, { Component } from 'react';

import { Segment, Image, Menu as MenuSU, Grid } from 'semantic-ui-react';

import { withTranslation } from 'react-i18next';

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	active_item:null
        }

        this.handleItemClick = this.handleItemClick.bind(this);

        window.onscroll = () => {
            let menu = document.getElementById('grid-menu');

            if(menu){
                let opacity_menu = (window.scrollY * 100)/150;
                opacity_menu = (opacity_menu > 99?99:opacity_menu)/100;

                menu.style = "z-index:1; min-height:87px; background-color:rgba(8, 46, 68, "+opacity_menu+") !important";

            	let items = document.getElementsByClassName('item-menu-bar');
            	this.setState({active_item:null});
            	for(let index in items){
            		if(items[index].dataset){
            			let element = document.getElementById(items[index].dataset.itemId);
            			let new_offset_top = element.offsetTop + (document.getElementById('slider-app').offsetHeight - 150);
            			//console.log(items[index].dataset.itemId, new_offset_top + ' - '+(new_offset_top + element.offsetHeight));
            			if(new_offset_top < window.scrollY && (new_offset_top + element.offsetHeight) > window.scrollY){
            				this.setState({active_item:items[index].dataset.itemId});
                            break;
                        }
            		}
            	}

                //Elementos que deben animarse cuando llega el scroll
                let items_animation = document.getElementsByClassName('scroll-animated');
                
                for(let index in items_animation){
                    //Si tiene animación asignada
                    if(items_animation[index].dataset && items_animation[index].dataset.animation){
                        const data_element = items_animation[index].getBoundingClientRect();
                        //Retraso en pixeles para determinar que un objeto es visible
                        const delay_top = parseFloat(items_animation[index].dataset.animationDelayTop?items_animation[index].dataset.animationDelayTop:0);
                        const delay_bottom = parseFloat(items_animation[index].dataset.animationDelayBottom?items_animation[index].dataset.animationDelayBottom:0);
                        
                        if( 
                            //La parte superior del elemento esta visible
                            (data_element.y + delay_top > 0 && data_element.y + delay_top < window.innerHeight)
                            //La parte inferior del elemento esta visible
                            || (
                                ((data_element.y + data_element.height) > 0 && (data_element.y + data_element.height) < window.innerHeight)
                                && (data_element.y + data_element.height) > delay_bottom
                            )
                            //La parte superior del elemento esta oculta arriba y ña parte superior
                            //esta oculta abajo (el elemento es visible y más grande del tamaño de la pantalla)
                            || (data_element.y < 0 && (data_element.y + data_element.height) > window.innerHeight)
                        ){
                            items_animation[index].classList.remove('opacity-0');
                            items_animation[index].classList.add('opacity-1');
                            items_animation[index].classList.add(items_animation[index].dataset.animation);
                        }else{
                            items_animation[index].classList.remove(items_animation[index].dataset.animation);
                            items_animation[index].classList.remove('opacity-1');
                            items_animation[index].classList.add('opacity-0');
                        }
                    }
                }
            }
        }
    }

	handleItemClick(e, {name}){
		this.setState({active_item:name});
		window.location.hash = name;
	}


    render() {
    	const { active_item } = this.state;
    	const { t } = this.props;

        return (
            <Grid id='grid-menu' className='m-0 p-0 pos-fixed w-100' style={{zIndex:1}}>
                <Grid.Row only='computer' className='p-0 m-0'>
                    <Grid.Column computer='16'>
                        <MenuSU inverted stackable className='p-0 m-0' borderless={true} style={{backgroundColor:'transparent'}}>
                            <MenuSU.Item
                                content={<Image src={base_resources+'/images/logo_icon/logo_xs_white.png'} size='small'/>}
                                name='home'
                            />
                            <MenuSU.Menu position='right'>
                                <MenuSU.Item
                                    content={t('menu.what_is')}
                                    name='what-is'
                                    data-item-id='what-is'
                                    className='item-menu-bar font-weight-500 uppercase'
                                    onClick={this.handleItemClick}
                                    active={active_item === 'what-is'}
                                />

                                <MenuSU.Item
                                    content={t('menu.how_work')}
                                    name='how-start'
                                    data-item-id='how-start'
                                    className='item-menu-bar font-weight-500 uppercase'
                                    onClick={this.handleItemClick}
                                    active={active_item === 'how-start'}
                                />

                                <MenuSU.Item
                                    content={t('menu.use_without_money')}
                                    name='use_without_money'
                                    data-item-id='use_without_money'
                                    className='item-menu-bar font-weight-500 uppercase'
                                    onClick={this.handleItemClick}
                                    active={active_item === 'use_without_money'}
                                />

                                <MenuSU.Item
                                    content={t('menu.our_team')}
                                    name='our-team'
                                    data-item-id='our-team'
                                    className='item-menu-bar font-weight-500 uppercase'
                                    onClick={this.handleItemClick}
                                    active={active_item === 'our-team'}
                                />
                            </MenuSU.Menu>

                            {/*<MenuSU.Menu position='right'>
                                <MenuSU.Item>
                                    <Button icon = 'user' className='' primary label={this.props.t('btn.login')} onClick={() => { window.location.href = 'https://www.app.trsoft-company.com'}}/>
                                    <Button icon = 'wpforms' className='m-l-1 ' positive label={this.props.t('btn.register')} onClick={() => { window.location.href = 'https://www.app.trsoft-company.com/register'}}/>
                                </MenuSU.Item>
                            </MenuSU.Menu>*/}
                        </MenuSU>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row only='tablet mobile' className='p-0 m-0'>
                    <Grid.Column computer='16'>
                        <Segment className='p-1 m-0 pos-fixed w-100' style={{zIndex:1, top:0, backgroundColor:'transparent'}}>
                            <Image src={base_resources+'/images/logo_icon/logo_xs_white.png'} size='small' centered/>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default withTranslation()(Menu);
