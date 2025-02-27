import React from "react";
import { AccordionExample, ButtonExample, IconExample, InputExample, LoaderExample } from "../components/lib";
import { Text } from '@epam/uui';

const Components = () => {
    return (
        <div className={ 'withGap' }>
            <Text size='42' fontSize='24' font='semibold'>Demo example with list of components</Text>
            <ButtonExample />
            <InputExample />
            <LoaderExample />
            <IconExample />
            <AccordionExample />
        </div>
    );
};

export default Components;