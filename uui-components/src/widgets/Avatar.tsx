import * as React from 'react';
import { IHasCX, cx, IHasRawProps, IHasForwardedRef } from '@epam/uui-core';
import * as css from './Avatar.scss';

export interface AvatarProps extends IHasCX, IHasRawProps<HTMLImageElement>, IHasForwardedRef<HTMLImageElement> {
    alt?: string;
    img: string;
    size: '12' | '18' | '24' | '30' | '36' | '42' | '48' | '54' | '60' | '72' | '78' | '90' | '144';
    isLoading?: boolean;
}

export class Avatar extends React.Component<AvatarProps> {
    render() {
        return (
            <img
                className={ cx(css.avatar, this.props.cx) }
                width={ this.props.size }
                height={ this.props.size }
                src={ (this.props.isLoading || !this.props.img) ? 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg' : this.props.img }
                alt={ this.props.alt }
                { ...this.props.rawProps }
            />
        );
    }
}
