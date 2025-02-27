import React from 'react';
import { renderWithContextAsync } from '@epam/test-utils';
import { DataTable } from '../DataTable';

class ResizeObserverMock {
    observe = () => jest.fn();
    unobserve = () => jest.fn();
    disconnect = () => jest.fn();
}

global.ResizeObserver = ResizeObserverMock;

describe('DataTable', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(
            <DataTable
                columns={ [] }
                getRows={ () => [] }
                value={ {} }
                onValueChange={ jest.fn }
            />
        );

        expect(tree).toMatchSnapshot();
    });
});


