import * as React from 'react';
import sortBy from 'lodash.sortby';
import { cx, DataColumnProps, DndActor } from '@epam/uui-core';
import { DragHandle, ColumnsConfigurationModalBase } from '@epam/uui-components';
import {
    ModalBlocker, ModalWindow, ModalFooter, FlexSpacer, Button, Panel, Checkbox, LinkButton, ModalHeader,
    ScrollBars, FlexRow, DropMarker,
} from '../';
import * as styles from './ColumnsConfigurationModal.scss';
import { i18n } from '../../i18n';

export class ColumnsConfigurationModal<TItem, TId> extends ColumnsConfigurationModalBase<TItem, TId> {
    renderDndRow = (column: DataColumnProps<TItem, TId>, prevColumn: string, nextColumn: string) => (
        <DndActor<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>
            key={ column.key }
            srcData={ column }
            dstData={ column }
            canAcceptDrop={ this.handleCanAcceptDrop }
            onDrop={ params => this.onDrop(params, prevColumn, nextColumn) }
            render={ props => (
                <div ref={ props.ref } { ...props.eventHandlers } className={ cx(styles.dragElement, ...props.classNames) }>
                    <div className={ styles.dndItem }>
                        <FlexRow background="white" spacing='6'>
                            <DragHandle cx={ [styles.dragHandle] } />
                            <Checkbox key={ column.key } label={ column.caption } { ...this.columnsLens.prop(column.key).prop('isVisible').toProps() } isDisabled={ column.isAlwaysVisible || !!column.fix }/>
                        </FlexRow>
                    </div>
                    <DropMarker { ...props } />
                </div>
            ) }
        />
    )

    render() {
        const { columns, ...modalProps } = this.props;
        const sortedColumns = sortBy(columns, i => this.state.columnsConfig[i.key].order);
        const widthForModal = this.modalWindowWidth > 600 ? this.modalWindowWidth : 600;

        return (
            <ModalBlocker blockerShadow="dark" { ...modalProps }>
                <ModalWindow width="600" height="auto" style={ { width: `${widthForModal}px` } }>
                    <Panel background="white" cx={ styles.container }>
                        <ModalHeader borderBottom title={ i18n.tables.columnsConfigurationModal.configureColumnsTitle } onClose={ () => modalProps.abort() } />
                        <ScrollBars>
                            <div className={ styles.checkboxContainer }>
                                { /*TODO: use ArrayDataSource(or Picker) for search*/ }
                                { sortedColumns
                                    .filter(column => !!column.caption)
                                    .map((item, index) => {
                                        const prevItem = index > 0 ? sortedColumns[index - 1] : sortedColumns[0];
                                        const nextItem = index === sortedColumns.length - 1 ? sortedColumns[0] : sortedColumns[index + 1];
                                        return this.renderDndRow(
                                            item,
                                            this.state.columnsConfig[prevItem.key].order,
                                            this.state.columnsConfig[nextItem.key].order,
                                        );
                                    }) }
                            </div>
                        </ScrollBars>
                        <ModalFooter borderTop >
                            <LinkButton caption={ i18n.tables.columnsConfigurationModal.resetToDefaultButton } color="blue" onClick={ () => this.setState({columnsConfig: this.props.defaultConfig}) } />
                            <LinkButton caption={ i18n.tables.columnsConfigurationModal.uncheckAllButton } color="blue" onClick={ this.handleMarkAllAsUnchecked } />
                            <LinkButton caption={ i18n.tables.columnsConfigurationModal.checkAllButton } color="blue" onClick={ this.handleMarkAllAsChecked } />
                            <FlexSpacer />
                            <Button fill="white" color="gray50" caption={ i18n.tables.columnsConfigurationModal.cancelButton } onClick={ () => modalProps.abort() } />
                            <Button cx={ styles.actionButton } caption={ i18n.tables.columnsConfigurationModal.applyButton } color="green" onClick={ () => modalProps.success(this.state.columnsConfig) } />
                        </ModalFooter>
                    </Panel>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}
