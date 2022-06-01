<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import _ImageChatBubble from "$assets/images/homepage/3dicons/chat-bubble-dynamic-color.webp";
    import _ImageDollar from "$assets/images/homepage/3dicons/dollar-dynamic-color.webp";
    import _ImageExplorer from "$assets/images/homepage/3dicons/explorer-dynamic-color.webp";
    // VSCode, why did you do this to me?
    import _ImageNotebook from "$assets/images/homepage/3dicons/notebook-dynamic-color.webp";
    import _ImagePuzzle from "$assets/images/homepage/3dicons/puzzle-dynamic-color.webp";
    import _ImageTool from "$assets/images/homepage/3dicons/tool-dynamic-color.webp";
    import Wordmark from "$assets/images/logo/wordmark.svg";
    import Meta from "$components/utils/Meta.svelte";
    import { random } from "$generated/homepage.json";
    import projects from "$generated/projects.json";
    import { onMount } from "svelte";
    import { t } from "svelte-intl-precompile";
    import IconSearch from "virtual:icons/heroicons-outline/search";

    // Seriously, these are strings.
    const ImageNotebook = _ImageNotebook as any;
    const ImageDollar = _ImageDollar as any;
    const ImageExplorer = _ImageExplorer as any;
    const ImageChatBubble = _ImageChatBubble as any;
    const ImagePuzzle = _ImagePuzzle as any;
    const ImageTool = _ImageTool as any;

    const colorsOffset = projects.length < 100 ? 0 : Math.floor(random * 60); // 100 (total projects) - 40 (used)

    function search(
        event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
    ) {
        const term = (event.target as any).term.value;
        goto(`/mods?q=${term}`);
    }

    const layout = [
        [1, 1],
        [1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
    ];

    const cdnDomain = `${
        (import.meta.env.VITE_API_URL || "api.modrinth.com")
            .toString()
            .includes("staging")
            ? "staging-"
            : ""
    }cdn.modrinth.com`;

    const checkCode = () => {
        if ($page.url.searchParams.get("code")) {
            $page.url.searchParams.delete("code");
            const params: string[] = [];
            $page.url.searchParams.forEach((v, k) => params.push(`${k}=${v}`));
            const url =
                $page.url.pathname +
                (params.length > 0 ? "?" : "") +
                params.join("&");
            goto(url);
        }
    };

    onMount(() => checkCode());

    const jsonLd = `{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://modrinth.com/",
      "potentialAction": {
        "@type": "SearchAction",
          "target": {
          "@type": "EntryPoint",
            "urlTemplate": "https://modrinth.com/mods?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }`;
</script>

<svelte:head>
    {@html '<script type="application/ld+json" ✂prettier:content✂="JyArIEpTT04uc3RyaW5naWZ5KGpzb25MZCkgKyAn" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=">{}</script>'}
</svelte:head>

<Meta
    fullTitle="Modrinth: Download and publish Minecraft Mods & Modpacks"
    description="Download Minecraft mods and modpacks on Modrinth. Discover and publish projects on Modrinth with a modern, easy to use interface and API."
/>

<div class="hero">
    <div class="stacks">
        {#each layout as row, rowIndex}
            <div class="stacks__row">
                {#each row as column, colIndex}
                    {@const index =
                        rowIndex * layout[rowIndex].length +
                        colIndex +
                        colorsOffset}
                    {#if column === 1 && projects?.[index]?.[0]}
                        <a
                            class="stacks__row__column"
                            href="/mod/{projects?.[index]?.[0] || ''}"
                            tabindex="-1"
                            style:--color={projects?.[index]?.[1] || ""}
                            style:--offset="{Math.round(random * 40 - 20)}px"
                            title={projects?.[index]?.[0]}
                        >
                            <div class="stacks__row__column__background" />
                            <img
                                class="stacks__row__column__face"
                                src="https://{cdnDomain}/data/{projects?.[
                                    index
                                ]?.[3] ||
                                    projects?.[index]?.[0]}/icon.{projects?.[
                                    index
                                ]?.[2] || ''}"
                                alt=""
                            />
                        </a>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>

    <Wordmark class="hero__wordmark" />
    <h1 class="hero__tagline">Discover, Play, & Create Minecraft content</h1>
    <form class="hero__search" on:submit|preventDefault={search}>
        <input
            type="text"
            placeholder={$t("project.types.mod.search")}
            name="term"
            class="hero__search__input"
        />
        <button type="submit" class="hero__search__button" title="Search">
            <IconSearch />
        </button>
    </form>
    <p class="hero__description">
        Find enjoyable and quality content through our open-source modding
        platform built for the community. Create stuff, get paid*, and deploy
        your project with our fully documented API!
    </p>
</div>

<div class="features">
    <div class="features__item">
        <img
            src={ImageNotebook}
            alt="Book with bookmark"
            class="features__item__image"
        />
        <div class="features__item__text">
            <h3 class="title-secondary">Easy to use API</h3>
            <p class="summary">
                Backed by a fully documented API facilitating the growth of 3rd
                party integrations & launchers.
            </p>
        </div>
    </div>
    <div class="features__item">
        <img src={ImageDollar} alt="Gold coin" class="features__item__image" />
        <div class="features__item__text">
            <h3 class="title-secondary">Creator earnings</h3>
            <p class="summary">
                Planning to give creators 100% of ad revenue from their project
                pages. *Payouts are currently in development.
            </p>
        </div>
    </div>
    <div class="features__item">
        <img
            src={ImageExplorer}
            alt="Speedometer"
            class="features__item__image"
        />
        <div class="features__item__text">
            <h3 class="title-secondary">Lightning-fast search</h3>
            <p class="summary">
                Powered by fast and adaptable search algorithms so you don't
                have to wait.
            </p>
        </div>
    </div>
    <div class="features__item">
        <img
            src={ImageChatBubble}
            alt="Two chat bubbles"
            class="features__item__image"
        />
        <div class="features__item__text">
            <h3 class="title-secondary">Helpful community</h3>
            <p class="summary">
                Get support, develop, and hangout on our Discord server with
                over 1K members.
            </p>
        </div>
    </div>
    <div class="features__item">
        <img
            src={ImagePuzzle}
            alt="Puzzle piece"
            class="features__item__image"
        />
        <div class="features__item__text">
            <h3 class="title-secondary">Extensible by design</h3>
            <p class="summary">
                Integrates with build tools, repositories, launchers, and custom
                applications.
            </p>
        </div>
    </div>
    <div class="features__item">
        <img
            src={ImageTool}
            alt="Screwdriver and wrench"
            class="features__item__image"
        />
        <div class="features__item__text">
            <h3 class="title-secondary">Fully open source</h3>
            <p class="summary">
                An open source project maintained by an active community that
                welcomes contributions.
            </p>
        </div>
    </div>
</div>

<style lang="postcss">
    .hero {
        width: 100%;
        min-height: 32rem;

        background-color: var(--color-raised-bg);
        border-radius: 2rem;
        overflow: hidden;
        box-shadow: var(--shadow-raised), var(--shadow-inset);
        position: relative;
        padding: 4rem;
        display: flex;
        flex-direction: column;
        grid-gap: 1.5rem;
        align-items: flex-start;

        @media (width < 750px) {
            padding: 2rem 2rem 2rem 2rem;
        }

        .stacks {
            --width: 7rem;
            --offset: 0px;
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            speak: none;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin-top: calc(var(--width) / 1.9);

            @media (width < 950px) {
                top: 10rem;
                --width: 5rem;

                &__row:nth-child(1),
                &__row:nth-child(2) {
                    display: none;
                }
            }

            &__row {
                display: flex;
                justify-content: flex-end;

                &:nth-of-type(odd) {
                    margin-right: calc(var(--width) * -0.5);
                }

                &__column {
                    width: var(--width);
                    height: calc(var(--width) * 0.85);
                    position: relative;
                    cursor: pointer;
                    transition: transform 0.2s ease-in-out;
                    --color: transparent;
                    transform: translateY(var(--offset));

                    &:hover {
                        transform: translateY(
                            calc(var(--width) / -5 + var(--offset))
                        );
                    }

                    &__background {
                        background: linear-gradient(
                                to right,
                                hsla(0deg, 0%, 0%, 0.1),
                                hsla(0deg, 0%, 0%, 0.2) 50%,
                                hsla(0deg, 0%, 0%, 0.4) 50%,
                                hsla(0deg, 0%, 0%, 0.5)
                            ),
                            linear-gradient(
                                to right,
                                var(--color),
                                var(--color)
                            );
                        height: 100vh;
                        position: absolute;
                        top: 0;
                        width: 100%;
                    }

                    &__face {
                        background-color: var(--color);
                        position: absolute;
                        top: 0;
                        width: calc(var(--width) / 1.75);
                        aspect-ratio: 1/1;
                        transform-origin: var(--width) var(--width);
                        /* These decimals aren't ideal, but they provide the correct size & transformation for the given `--width` */
                        transform: rotate(30deg) skew(-30deg)
                            translate(calc(var(--width) * -0.58), 0)
                            scaleY(0.864);
                    }
                }
            }
        }

        :not(.stacks) {
            z-index: 1;
        }

        :global(&__wordmark) {
            height: 5rem;
            width: auto;

            @media (width < 750px) {
                height: 4rem;
            }

            @media (width < 500px) {
                height: auto;
                width: 80%;
            }
        }

        &__tagline {
            font-weight: 500;
            font-size: 1.8rem;
            width: calc(100% - 21rem);
            line-height: 130%;

            @media (width < 950px) {
                width: 100%;
                font-size: 1.5rem;
            }
        }

        &__search {
            width: 50%;
            @media (width < 950px) {
                width: 100%;
            }
            display: flex;
            align-items: center;

            &__input {
                background-color: var(--color-button-bg);
                border-radius: 0.8rem;
                box-shadow: var(--shadow-raised), var(--shadow-inset);
                padding: 0.5rem 1.25rem;
                border: none;
                width: 100%;
            }

            &__button {
                margin-left: -2.25rem;
                z-index: 2;
                display: flex;
            }
        }

        &__description {
            width: calc(100% - 30rem);

            @media (width < 950px) {
                width: 100%;
                margin-bottom: 13.5rem;
                font-size: 1rem;
            }

            font-size: 1.2rem;
            line-height: 130%;
        }
    }

    .features {
        display: flex;
        flex-wrap: wrap;

        &__item {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            align-items: center;
            flex-basis: 33.33%;
            text-align: center;
            grid-gap: 0.75rem;

            &__text {
                display: flex;
                flex-direction: column;
                grid-gap: 0.75rem;
            }

            @media (width <= 820px) {
                flex-basis: 50%;
            }
        }

        @media (width <= 500px) {
            grid-gap: 1rem;

            &__item {
                flex-basis: 100%;
                flex-direction: row;
                grid-gap: 1rem;
                text-align: left;

                &__image {
                    width: 6rem;
                }

                &:nth-child(odd) {
                    flex-direction: row-reverse;
                }
            }
        }
    }
</style>
