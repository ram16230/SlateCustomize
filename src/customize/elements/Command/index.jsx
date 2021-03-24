import * as React from 'react';
import { useRef } from 'react';
import { Editor, Transforms, Text } from 'slate';
import { MdErrorOutline } from 'react-icons/md';

import Menu from './menu';
import { Elements } from '../index';
import { InsertGenerator } from '../../../customize/elements/actionGenerator';
import styles from './command.module.css';

const name = 'command';
const command = '';
const type = 'inline';

const set = ({ event, editor, at }) => {
    const options = {
        match: n => Text.isText(n) && n.type !== type,
        split: true,
    };
    if (at) options.at = at;
    Transforms.setNodes(
        editor,
        { element: name },
        options,
    );
}

export const unset = ({event, editor, at}) => {
    const options = {
        match: n => Text.isText(n) && n.type !== type,
        split: true,
    };
    if (at) options.at = at;
    Transforms.unsetNodes(
        editor,
        ['element'],
        options,
    );
}

const insert = InsertGenerator({ name, type });

const Placeholder = ({ editor, ...props}) => {
    if (props.condition) {
        const path = editor.selection.anchor.path;
        return (
            <a
                contentEditable={false}
                className={styles.placeholder}
                onClick={() => Transforms.select(editor, { offset: 1, path }) }
            >
            <span
                style={{
                    pointerEvents: "none",
                    display: "inline",
                    width: "0",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    opacity: 0.333,
                    verticalAlign: "text-top",

                    // placeholders shouldn't interfere with height
                    // of the object
                    height: 0
                }}
                contentEditable={false}
            >
                {props.children}
            </span>
            </a>
        );
    }
    return null;
}

const Element = (props) => {
    const ref = useRef();
    const text = props.children.props.text.text;
    const editor = props.editor;
    const elements = props.elements ? props.elements : Elements; // get default or receive from editor
    return (
        <span
            ref={ref}
            className={styles.command}
        >
            <span {...props.attributes}>
                {props.children}
            </span>
            <Placeholder editor={editor} condition={text === '/' || text === '/ '}> Insert command...</Placeholder>
            {/*$FlowFixMe*/}
            <Menu text={text} command={ref} elements={elements} />
        </span>
    );
}

const definition = {
    name,
    command,
    component: Element,

    create: () => ({ element: 'command', type: 'inline' }),

    type,
    set,
    unset,
    insert,
};

export default definition;