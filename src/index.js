import { EditorView } from 'codemirror';
import { highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine, keymap } from '@codemirror/view';
export { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import './style.css';

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLDialogElement) {
                    const target = node.querySelector('textarea.maximized_textarea');
                    if (target) {
                        setupCodeMirror(target);
                    }
                }
            });
        }
    });
});

observer.observe(document.body, {
    childList: true,
});

/**
 * Setup CodeMirror for the target textarea element.
 * @param {HTMLTextAreaElement} target
 */
function setupCodeMirror(target) {
    const host = document.createElement('div');
    host.classList.add('codemirror-host');
    target.classList.add('displayNone');
    target.parentElement.appendChild(host);
    new EditorView({
        doc: target.value,
        extensions: [
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            bracketMatching(),
            closeBrackets(),
            highlightActiveLine(),
            EditorView.lineWrapping,
            highlightSelectionMatches(),
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
            ]),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    target.value = update.state.doc.toString();
                    target.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }),
        ],
        parent: host,
    });
}
