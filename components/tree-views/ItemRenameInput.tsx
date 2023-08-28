import React, {FormHTMLAttributes, HTMLProps, InputHTMLAttributes, Ref} from "react";
import {Check} from "lucide-react";

interface RenameInputProps {
    inputProps: InputHTMLAttributes<HTMLInputElement>;
    inputRef: Ref<HTMLInputElement>;
    submitButtonProps: HTMLProps<any>;
    submitButtonRef: Ref<any>;
    formProps: FormHTMLAttributes<HTMLFormElement>;
}

const ItemRenameInput: React.FC<RenameInputProps> = (props) => {
    const {
        formProps,
        inputProps,
        inputRef,
        submitButtonProps,
        submitButtonRef,
    } = props;

    return (
        <form {...formProps} className="flex flex-grow">
            <input
                {...inputProps}
                ref={inputRef}
                autoFocus
                className="flex-grow bg-inherit outline-none"
            />

            <button
                {...submitButtonProps}
                ref={submitButtonRef}
                type="submit"
                className="h-8 w-8 rounded p-2 hover:bg-neutral-700"
            >
                <Check className="h-4 w-4"/>
            </button>
        </form>
    );
};
export default ItemRenameInput;