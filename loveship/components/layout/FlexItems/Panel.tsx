import * as css from './Panel.scss';
import { VPanel } from '@epam/uui-components';
import { withMods, VPanelProps } from '@epam/uui-core';

export interface PanelMods {
    shadow?: boolean;
    margin?: '24';
    background?: 'white' | 'night50';
}

export const Panel = withMods<VPanelProps, PanelMods>(VPanel, props => [
    css.root,
    props.shadow && css.shadow,
    props.margin && css['margin-' + props.margin],
    props.background && css['background-' + props.background],
]);