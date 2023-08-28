import {InteractionManager, InteractionMode} from "react-complex-tree";

const customInteractionMode: InteractionManager = {
    mode: "custom",
    extends: InteractionMode.ClickArrowToExpand,
    createInteractiveElementProps: (item, treeId, actions, renderFlags) => {
        return {
            onClick: (e) => {
                e.stopPropagation();
                actions.focusItem();
                if (e.shiftKey) {
                    actions.selectUpTo(!e.ctrlKey);
                } else if (e.ctrlKey || e.metaKey) {
                    if (renderFlags.isSelected) {
                        actions.unselectItem();
                    } else {
                        actions.addToSelectedItems();
                    }
                } else {
                    // actions.selectItem();
                    actions.primaryAction();
                }
            },
        };
    },
};
export default customInteractionMode;
