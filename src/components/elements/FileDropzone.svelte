<script lang="ts">
    import IconUpload from "virtual:icons/heroicons-outline/upload";

    export let multiple = false;
    export let accept: string;

    export let files = [];
    let inputElement;

    function openFileDialog() {
        if (inputElement) {
            inputElement.click();
        }
    }

    function dropFiles(e) {
        const droppedFiles = e.dataTransfer.files;

        if (droppedFiles) {
            if (!multiple) {
                files = [];
                inputElement.value = "";
            }

            [...droppedFiles].forEach((file, index) => {
                if (multiple || index === 0) {
                    files.push(file);
                }
            });
        }
    }
</script>

<div
    class="file-dropzone"
    on:drop|preventDefault={dropFiles}
    on:dragover|preventDefault
    on:click={openFileDialog}
>
    <IconUpload />
    Drag and drop to upload or click to select
    <input
        type="file"
        {multiple}
        {accept}
        style:display="none"
        bind:this={inputElement}
        on:change={(event) => (files = [...event.target.files])}
    />
</div>

<style lang="postcss">
    .file-dropzone {
        display: flex;
        width: 100%;
        padding: 1.5rem 1rem;
        justify-content: center;
        align-items: center;
        grid-gap: 0.5rem;
        background-color: var(--color-button-bg);
        border-radius: var(--rounded-sm);
        border: dashed 0.3rem var(--color-text-lightest);
        cursor: pointer;
        color: var(--color-text-light);
    }
</style>
