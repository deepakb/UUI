import React from 'react';
import { MainMenuSearch } from '../MainMenuSearch';
import { renderWithContextAsync } from "@epam/test-utils";

describe('MainMenuSearch', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(
            <MainMenuSearch
                value={ null }
                onValueChange={ jest.fn }
            />,
        );

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderWithContextAsync(
            <MainMenuSearch
                value={ 'test' }
                onValueChange={ jest.fn }
                caption='Test button'
                type='primary'
                collapseToMore
                estimatedWidth={ 120 }
                showInBurgerMenu
                priority={ 6 }
            />,
        );

        expect(tree).toMatchSnapshot();
    });
});


