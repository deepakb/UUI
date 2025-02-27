import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext } from '../../../docs/index';
import { AvatarStackProps } from '@epam/uui-components';
import { AvatarStack, Tooltip } from "../../";
import { uuiMarkers } from "@epam/uui-core";
import React from "react";

const renderItem = (url: string) => {
    const handleClick = () => {
        console.log("handleClick");
    };

    return (
        <Tooltip content='Some text' placement='bottom' >
            <img
                src={ url }
                alt='avatar'
                width={ 36 }
                height={ 36 }
                onClick={ handleClick }
                className={ uuiMarkers.clickable }
            />
        </Tooltip>
    );
};

const AvatarStackDoc = new DocBuilder<AvatarStackProps>({ name: 'AvatarStack', component: AvatarStack })
    .prop('urlArray', {
        examples: [
            {
                name: 'Olivia',
                value: [
                    "https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50",
                    "https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50",
                    "https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50",
                ],
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .prop('avatarSize', {
        examples: ['24', '36', { name: '48', value: '48', isDefault: true }, '144'],
        isRequired: true,
    })
    .prop('direction', {
        examples: [{ name: 'left', value: 'left', isDefault: true }, 'right'],
        isRequired: true,
    })
    .prop('renderItem', {
        examples: [
            {
                value: renderItem,
                name: '(url) => <CustomAvatarItem />',
                isDefault: false,
            },
        ],
    })
    .withContexts(DefaultContext);

export = AvatarStackDoc;