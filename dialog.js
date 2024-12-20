export default class Dialog {
    constructor(openButton, dialogId, title, content, icon = null, buttons = null, callback = null) {
        this.openButton = openButton;
        this.dialogId = dialogId;
        this.title = title;
        this.content = content;
        this.icon = icon;
        this.buttons = buttons;
        this.callback = callback;
        this.opened = false;
    }

    init = () => {
        this.createDialog();
        this.addShowListener();
        this.addCloseListener();
    }

    createDialog = () => {
        const dialog = document.createElement('dialog');
        dialog.id = `dialog-${this.dialogId}`;

        const titleBar = document.createElement('div');
        titleBar.classList.add('dialogTitleBar');

        if (this.icon) {
            titleBar.append(this.icon);
        }

        const titleText = document.createElement('span');
        titleText.innerText = this.title;

        titleBar.append(titleText);
        dialog.append(titleBar);
        this.content.classList.add('dialogContent');
        dialog.append(this.content);

        const footer = document.createElement('div');
        footer.classList.add('dialogFooter');

        if (this.buttons) {
            footer.append(this.buttons);
        } else {
            const closeButton = document.createElement('button');
            closeButton.id = `dialog-close-${this.dialogId}`;
            closeButton.innerText = `Fermer`;
            footer.append(closeButton);
        }

        dialog.append(footer);
        document.body.append(dialog);
    }

    addShowListener = () => {
        const addElementListener = (element) => {
            console.log(element)
            element.addEventListener('click', (event) => {
                event.preventDefault();
                const dialog = document.getElementById(`dialog-${this.dialogId}`);
                if (!dialog) {
                    this.opened = false;
                    this.createDialog();
                    this.addCloseListener();
                }
                this.showDialog();
                if (!this.opened && this.callback) {
                    this.callback();
                }
                this.opened = true;
            });
        }
        if (this.openButton instanceof NodeList) {
            this.openButton.forEach(btn => {
                addElementListener(btn);
            });
        } else {
            addElementListener(this.openButton);
        }
    }

    addCloseListener = () => {
        if (!this.buttons) {
            const closeButton = document.getElementById(`dialog-close-${this.dialogId}`);
            closeButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.closeDialog();
            });
        }
    }

    showDialog = () => {
        const dialog = document.getElementById(`dialog-${this.dialogId}`);
        dialog.showModal();
    }

    closeDialog = () => {
        const dialog = document.getElementById(`dialog-${this.dialogId}`);
        dialog.close();
    }
}