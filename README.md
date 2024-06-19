<img src="https://github.com/modrinth/knossos/assets/6166773/79cb3584-5c78-4632-bb20-ea21ddb8f94e" alt="modrinth.com: knossos (web frontend)">

# Modrinth.com

<img src="https://github.com/modrinth/knossos/assets/6166773/3b6e47e8-6b92-4702-b707-38a225982f96" alt="Screenshot of the Modrinth website's browse page for mods" align="right" width="50%">

The Modrinth.com frontend, codenamed knossos, is the web interface used for interacting with Modrinth services, built with [Nuxt.js](https://nuxt.com/).

### Features
- Browsing for mods, data packs, resource packs, modpacks, and more hosted on Modrinth
- Uploading your own project to Modrinth
- Clean and modern interface that simplifies things enough for the layuser but with enough depth for a power user
- Save projects to a collection to come back to later
- Follow projects to get notifications when they update
- Fully open source under AGPLv3[^1]!
- Many more features for interacting with Modrinth services

[^1]: Modrinth's logos, branding, and other trademarks are not free for use, see the [licensing section](#license) for more information.

## Contributing
You're welcome to help contribute to Knossos if you'd like! Please review our [contribution guide](https://support.modrinth.com/en/articles/8802215-contributing-to-modrinth) before attempting to contribute or make a pull request though.

## Development
To get started, install [pnpm](https://pnpm.io/). Then, run the following commands:

```
pnpm install
pnpm run dev
```

Once that's done, you'll be serving knossos on `localhost:3000` with hot reloading. You can run `pnpm run build` to build for a production server and `pnpm run start` to start the server. You can also use `pnpm run lint` to find any eslint problems, and `pnpm run fix` to try automatically fixing those problems.

If you've never used Nuxt before, check out the [Nuxt.js docs](https://nuxt.com/docs).

## License
The source code of the knossos repository is licensed under the GNU Affero General Public License, Version 3 only, which is provided in the file [LICENSE](https://github.com/modrinth/knossos/blob/master/LICENSE). However, some files are licensed under a different license.

Any files depicting the Modrinth branding, including the wrench-in-labyrinth logo, the landing image, and variations thereof, are licensed as follows:
> All rights reserved. © 2020-2024 Rinth, Inc.

Forking is permitted under the AGPLv3, however do be aware that you must remove all Modrinth branding, including logos, brand colors, background images, or anything else that is related to trademarks or copyrights held by Rinth, Inc.
