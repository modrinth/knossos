<script lang="ts">
    import Nav from "$components/elements/Nav.svelte";
</script>

<div class="single-layout">
    <div class="card">
        <Nav
            links={[
                {
                    label: "Terms and conditions",
                    href: "/terms",
                },
                {
                    label: "Privacy policy",
                    href: "/privacy",
                },
                {
                    label: "Project rules",
                    href: "/rules",
                },
            ]}
            level={1}
        />
    </div>
    <div class="card text">
        <slot />
    </div>
</div>
