<script lang="ts">
    import Multiselect from "$components/elements/Multiselect.svelte";
    import { theme } from "$stores/server";
    import { t } from "svelte-intl-precompile";
    import IconMoon from "virtual:icons/heroicons-outline/moon";
    import IconSun from "virtual:icons/heroicons-outline/sun";
</script>

<Multiselect
    label={$t(`footer.buttons.theme.${$theme}`)}
    options={[
        {
            label: $t("footer.buttons.theme.system"),
            value: "system",
        },
        {
            label: $t("footer.buttons.theme.light"),
            value: "light",
        },
        {
            label: $t("footer.buttons.theme.dark"),
            value: "dark",
        },
        {
            label: $t("footer.buttons.theme.modrinth-light"),
            value: "modrinth-light",
        },
        {
            label: $t("footer.buttons.theme.modrinth-dark"),
            value: "modrinth-dark",
        },
        {
            label: $t("footer.buttons.theme.oled"),
            value: "oled",
        },
        {
            label: $t("footer.buttons.theme.modrinth-oled"),
            value: "modrinth-oled",
        },
    ]}
    color="raised"
    bind:value={$theme}
    icon={["dark", "oled", "modrinth-dark", "modrinth-oled"].includes($theme)
        ? IconSun
        : IconMoon}
/>
