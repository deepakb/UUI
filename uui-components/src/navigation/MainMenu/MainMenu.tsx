import React, { MouseEvent , useCallback} from 'react';
import Measure, { MeasuredComponentProps } from 'react-measure';
import orderBy from 'lodash.orderby';
import { IAdaptiveItem, ICanRedirect, IHasCaption, IHasChildren, IHasCX, Link, IHasRawProps, cx, IHasForwardedRef } from '@epam/uui-core';
import { ButtonProps } from '../../buttons';
import { BurgerProps, MainMenuLogo } from './index';
import { i18n } from '../../../i18n';
import * as css from './MainMenu.scss';

export interface MainMenuDropdownProps extends IHasChildren, IHasCaption, IAdaptiveItem, ICanRedirect, IHasCX, IHasRawProps<HTMLElement> {}

export interface MainMenuProps extends IHasCX, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    children: any;
    externalGap?: number;
    appLogoUrl?: string;
    appLogoBgColor?: string;
    customerLogoUrl?: string;
    customerLogoBgColor?: string;
    customerLogoWidth?: number;
    isTransparent?: boolean;
    renderBurger?: (props: { onClose: () => void }) => React.ReactNode;
    alwaysShowBurger?: boolean;
    serverBadge?: string;
    tooltipTechInfo?: React.ReactNode;
    logoLink?: Link;
    logoHref?: string;
    logoWidth?: number;
    onLogoClick?: (e: MouseEvent) => any;
    customerLogoLink?: Link;
    customerLogoHref?: string;
    MainMenuDropdown?: React.ComponentType<MainMenuDropdownProps>;
    Burger?: React.ComponentType<BurgerProps>;
}

interface MainMenuState {
    isSidebarOpened?: boolean;
}

interface ItemProps {
    priority: number;
    width: number;
    reactElement?: React.ReactElement<IAdaptiveItem & ButtonProps>;
    showInBurgerMenu?: boolean;
    caption?: string;
    link?: Link;
    href?: string;
    collapseToMore?: boolean;
    type?: any;
    children?: any;
}

export const uuiMainMenu = {
    container : 'uui-mainmenu-container',
    serverBadge: 'uui-mainmenu-server-badge',
    serverBadgeLabel: 'uui-mainmenu-server-badge-label',
    transparent: 'uui-mainmenu-transparent',
} as const;

function adaptItems<T extends { width: number; priority: number }>(
    items: T[],
    width: number,
): { visibleItems: T[]; hiddenItems: T[] } {
    const itemsByPriority = orderBy(items, item => item.priority, 'desc');

    let currentWidth = 0;
    let notVisiblePriority = -1;

    for (const child of itemsByPriority) {
        currentWidth += child.width;
        if (currentWidth > width) {
            notVisiblePriority = child.priority;
            break;
        }
    }

    const visibleItems: T[] = items.filter(item => item.priority > notVisiblePriority);
    const hiddenItems: T[] = items.filter(item => item.priority <= notVisiblePriority);

    const result = {
        visibleItems,
        hiddenItems,
    };

    return result;
}

function convertReactChildrenToItems(children: any): ItemProps[] {
    const items: ItemProps[] = React.Children.map(
        children,
        (child) => {
            if (child) {
                const item: ItemProps = {
                    width: child.props.estimatedWidth || 0,
                    priority: child.props.priority || 0,
                    reactElement: child,
                    showInBurgerMenu: child.props.showInBurgerMenu,
                    caption: child.props.caption,
                    link: child.props.link,
                    href: child.props.href,
                    collapseToMore: child.props.collapseToMore,
                    type: child.type,
                    children: child.props.children,
                };

                return item;
            }
        },
    );

    return items;
}

function isCollapsibleToMore(item: ItemProps) {
    return item.collapseToMore && !!item.caption;
}

class MainMenuImpl extends React.Component<MainMenuProps & MeasuredComponentProps, MainMenuState> {
    constructor(props: MainMenuProps & MeasuredComponentProps) {
        super(props);

        this.state = {
            isSidebarOpened: false,
        };
    }

    renderServerBadge() {
        let serverBadgeColor;
        if (!this.props.serverBadge) {
            return;
        } else {
            switch (this.props.serverBadge) {
                case 'Dev':
                    serverBadgeColor = '#39b7ac';
                    break;
                case 'QA':
                    serverBadgeColor = '#a3c644';
                    break;
                case 'UAT':
                    serverBadgeColor = '#937ebd';
                    break;
                default:
                    serverBadgeColor = '#30b6dd';
            }
        }

        return (this.props.serverBadge !== 'Prod' && this.props.serverBadge !== 'Public' && this.props.serverBadge !== 'Demo') ?
            (<div className={ cx(uuiMainMenu.serverBadge) }>
                    <div className={ cx(uuiMainMenu.serverBadgeLabel) } style={ { background: serverBadgeColor } }>
                        { this.props.serverBadge }
                    </div>
                </div>)
            : null;
    }

    renderMenuItems(itemsToRender: ItemProps[], hiddenItems: ItemProps[], containerWidth: number) {
        const MainMenuDropdown = this.props.MainMenuDropdown;
        const Burger = this.props.Burger;

        return itemsToRender.map((item) => {
            if (item.reactElement) {
                return item.reactElement;
            } else {
                switch (item.type) {
                    case 'appLogo':
                        return (
                            <MainMenuLogo
                                key={ item.type }
                                logoUrl={ this.props.appLogoUrl }
                                link={ this.props.logoLink }
                                href={ this.props.logoHref }
                                onClick={ this.props.onLogoClick }
                            />
                        );
                    case 'customerLogo':
                        return (
                            <MainMenuLogo
                                key={ item.type }
                                logoUrl={ this.props.customerLogoUrl }
                                logoBgColor={ this.props.customerLogoBgColor }
                                link={ this.props.customerLogoLink || this.props.logoLink  }
                                href={ this.props.customerLogoHref || this.props.logoHref }
                                showArrow
                            />
                        );
                    case 'moreButton':
                        return (
                            MainMenuDropdown && <MainMenuDropdown
                                key={ 'moreDropdown' }
                                caption={ i18n.mainMenu.moreButtonCaption }
                                children={ hiddenItems.map(item => item.reactElement) }
                            />
                        );
                    case 'burger':
                        if (this.props.renderBurger) {
                            return (
                                Burger && <Burger
                                    key={ 'burger' }
                                    width={ containerWidth }
                                    renderBurgerContent={ this.props.renderBurger }
                                    logoUrl={ this.props.customerLogoUrl || this.props.appLogoUrl }
                                    bg={ this.props.customerLogoBgColor || undefined }
                                />
                            );
                        }
                }
            }
        });
    }

    handleRef = (node: HTMLElement) => {
        this.props.measureRef(node as HTMLElement);
        (this.props.forwardedRef as React.RefCallback<HTMLElement>)?.(node);
    }

    render() {
        const childrenItems = convertReactChildrenToItems(this.props.children);

        const appLogoItem: ItemProps = {
            width: this.props.logoWidth || 201,
            priority: 100500,
            type: 'appLogo',
        };

        const customerLogoItem: ItemProps = {
            width: this.props.customerLogoWidth,
            priority: 100499,
            type: 'customerLogo',
        };

        const burger: ItemProps = {
            width: 60,
            priority: 100501,
            type: 'burger',
        };

        let menuItems = [...childrenItems];

        if (this.props.appLogoUrl) {
            menuItems.unshift(appLogoItem);
        }

        if (this.props.customerLogoUrl) {
            menuItems.unshift(customerLogoItem);
        }

        if (this.props.alwaysShowBurger) {
            menuItems.unshift(burger);
        }

        const staticWidth = 0;
        const containerWidth = this.props.contentRect.bounds.width - staticWidth;
        const firstStep = adaptItems(menuItems, containerWidth);
        const moreWidth = 70;
        let hiddenItems: ItemProps[] = [];
        let itemsToRender: ItemProps[] = [];

        if (firstStep.hiddenItems.length === 0) {
            itemsToRender = firstStep.visibleItems;
        } else {
            const secondStep = adaptItems(firstStep.visibleItems, containerWidth - moreWidth);
            hiddenItems = [...secondStep.hiddenItems, ...firstStep.hiddenItems];
            if (
                hiddenItems.every(item => isCollapsibleToMore(item)) &&
                secondStep.visibleItems.some(item => isCollapsibleToMore(item))
            ) {
                itemsToRender = [];
                let isMoreCollapsibleFound = false;
                let isMoreInjected = false;

                secondStep.visibleItems.forEach(i => {
                    const isCollapsible = isCollapsibleToMore(i);
                    isMoreCollapsibleFound = isMoreCollapsibleFound || isCollapsible;
                    if (isMoreCollapsibleFound && !isCollapsible && !isMoreInjected) {
                        isMoreInjected = true;
                        itemsToRender.push({
                            width: moreWidth,
                            priority: 0,
                            type: 'moreButton',
                        });
                    }
                    itemsToRender.push(i);
                });
            } else {
                const thirdStep = adaptItems(
                    menuItems.filter(i => !isCollapsibleToMore(i)),
                    this.props.alwaysShowBurger ? containerWidth : containerWidth - 60,
                );

                if (this.props.alwaysShowBurger) {
                    itemsToRender = thirdStep.visibleItems;
                } else {
                    itemsToRender = [burger, ...thirdStep.visibleItems];
                }
            }
        }

        return (
            <nav
                key='uuiMainMenu'
                ref={ this.handleRef }
                className={ cx(
                    this.props.cx,
                    uuiMainMenu.container,
                    css.container,
                    this.props.isTransparent && uuiMainMenu.transparent
                ) }
                { ...this.props.rawProps }
            >
                { this.renderMenuItems(itemsToRender, hiddenItems, containerWidth) }
                { this.renderServerBadge() }
            </nav>
        );
    }
}

export const MainMenu: React.FC<MainMenuProps> = (props) => (
    <Measure bounds>
        { (measureProps) => <MainMenuImpl { ...props } { ...measureProps } /> }
    </Measure>
)