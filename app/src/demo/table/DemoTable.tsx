import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Person } from '@epam/uui-docs';
import { DataRowOptions, cx, useLazyDataSource, useUuiContext, UuiContexts, ITablePreset, useTableState } from "@epam/uui-core";
import { Presets, FlexRow } from '@epam/uui';
import { DataTable } from '@epam/promo';
import css from './DemoTable.scss';
import type { TApi } from '../../data';
import { getFilters, api } from './data';
import { getColumns } from './columns';
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from './types';
import { FilterPanel } from './FilterPanel';
import { InfoSidebarPanel } from './InfoSidebarPanel';
import { SlidingPanel } from './SlidingPanel';
import { FilterPanelOpener } from './FilterPanelOpener';

export const DemoTable: React.FC = () => {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
    const [isInfoPanelOpened, setIsInfoPanelOpened] = useState(false);
    const closeInfoPanel = useCallback(() => setIsInfoPanelOpened(false), []);

    const [initialPresets, setInitialPresets] = useState<ITablePreset[]>([]);
    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(getColumns, []);

    useEffect(() => {
        svc.api.presets.getPresets()
            .then(setInitialPresets)
            .catch(console.error);
    }, []);

    const tableStateApi = useTableState({
        columns: columnsSet,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

    const dataSource = useLazyDataSource<PersonTableRecord, PersonTableRecordId, PersonTableFilter>({
        api,
        getId: i => [i.__typename, i.id],
        getChildCount: item => item.__typename === 'PersonGroup' ? item.count : null,
    }, []);

    const { current: rowOptions } = React.useRef<DataRowOptions<PersonTableRecord, PersonTableRecordId>>({
        checkbox: { isVisible: true },
        isSelectable: true,
        onClick(rowProps) {
            rowProps.onSelect(rowProps);
            setIsInfoPanelOpened(true);
        },
    });

    const personsDataView = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {
        rowOptions,
        isFoldedByDefault: () => true,
        cascadeSelection: true,
    });

    return (
        <div className={ css.wrapper }>
            <FilterPanelOpener
                isFilterPanelOpened={ isFilterPanelOpened }
                setIsFilterPanelOpened={ setIsFilterPanelOpened }
            />

            <SlidingPanel isVisible={ isFilterPanelOpened } width={ 288 } position="left">
                <FilterPanel
                    { ...tableStateApi }
                    filters={ filters }
                    columns={ columnsSet }
                    closePanel={ () => setIsFilterPanelOpened(false) }
                />
            </SlidingPanel>

            <div className={ css.container }>
                <FlexRow
                    borderBottom
                    cx={ cx(css.presets, { [css.presetsWithFilter]: isFilterPanelOpened }) }
                >
                    <Presets { ...tableStateApi } />
                </FlexRow>

                <DataTable
                    headerTextCase='upper'
                    getRows={ personsDataView.getVisibleRows }
                    columns={ columnsSet }
                    filters={ filters }
                    value={ tableStateApi.tableState }
                    onValueChange={ tableStateApi.setTableState }
                    showColumnsConfig={ true }
                    allowColumnsResizing
                    allowColumnsReordering
                    { ...personsDataView.getListProps() }
                />
            </div>

            <InfoSidebarPanel
                data={ dataSource.getById(["Person", tableStateApi.tableState.selectedId?.[1]]) as Person }
                isVisible={ isInfoPanelOpened }
                onClose={ closeInfoPanel }
            />
        </div>
    );
};