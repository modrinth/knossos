import { writable } from "svelte/store";

interface Popup {
    title: string;
    body?: string;
    type?: {
        deletion?: {
            key: string;
        };
        report?: boolean;
        creation?: "project" | "galleryItem";
        moderation?: boolean;
    };
    button?: {
        label: string;
        click: ({
            body,
            status,
            report_type,
            project_type,
            name,
            file,
        }) => Promise<void>;
    };
    style?: {
        wide?: boolean;
    };
}

export const popups = writable<Popup[]>([]);
