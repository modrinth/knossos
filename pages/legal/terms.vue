<template>
  <div class="main">
    <div class="card">
      <h1>Terms and Conditions</h1>

      <h2>0. Boilerplate</h2>

      <p>
        References in this document to "Modrinth", "we", "us", and "our" refer
        to Rinth, Inc., a domestic corporation registered in the State of
        Delaware. "Our website" refers to the website which you are browsing
        right now, which can primarily be accessed through
        <a href="https://modrinth.com">modrinth.com</a>.
      </p>

      <p>
        Any claim related to Rinth, Inc. and our website shall be governed by
        the laws of the United States and of the State of Delaware, without
        regard to conflict of law.
      </p>

      <h2>1. About these Terms</h2>

      <p>
        By accessing our website, you are agreeing to be bound by these Terms
        and Conditions as well as our
        <nuxt-link to="/legal/privacy">Privacy Policy</nuxt-link>. You agree
        that you are responsible for the agreement with regard to any applicable
        local laws. If you disagree with any of these terms, you are prohibited
        from accessing this site. The materials contained in our website are
        protected by copyright and trade mark law.
      </p>

      <h2>2. Disclaimer</h2>

      <p>
        All the materials on our website are provided "as is". We make no
        warranties, may it be expressed or implied, including but not limited to
        the warranties of merchantability, fitness for a particular purpose, and
        noninfringement. Furthermore, we do not make any guarantee concerning
        the accuracy or reliability of the use of the materials on our website.
      </p>

      <h2>3. Limitations</h2>

      <p>
        Rinth, Inc. and its suppliers will not be hold accountable for any
        damages that will arise with the use or inability to use the materials
        on our website, even if we or an authorized representative of ours has
        been notified, orally or written, of the possibility of such damage.
        Some jurisdictions do not allow limitations on implied warranties or
        limitations of liability for incidental damages, so these limitations
        may not apply to you.
      </p>

      <h2>4. Revisions and errata</h2>

      <p>
        The materials appearing on our website may include technical,
        typographical, or photographic errors. We do not promise that any of the
        materials on our website are accurate, complete, or current. We may
        change the materials contained on our website at any time without
        notice, though we do not make any commitment to updating the materials.
      </p>

      <h2>5. External links</h2>

      <p>
        We have not reviewed all of the sites linked externally from our website
        and we are not responsible for the contents of any such linked site. The
        presence of a link does not imply our endorsement of the site. The use
        of any linked website is at the user's own risk.
      </p>

      <h2>6. Modifications of these Terms</h2>

      <p>
        We may revise these Terms and Conditions for our website at any time
        without prior notice. By using this Website, you are agreeing to be
        bound by the current version of these Terms and Conditions.
      </p>

      <h2>7. Content</h2>

      <p>
        When you upload text, software, mods, scripts, graphics, photos, audio,
        videos, links, interactive features and other materials that may be
        viewed on or accessed through Modrinth, we refer to it as "Content".
      </p>

      <ul>
        <li>
          You are responsible for all activity and Content that is uploaded
          under your Modrinth account.
        </li>
        <li>
          You retain all of your ownership rights to your Content. We do not
          claim any ownership in or to any of your Content.
        </li>
        <li>
          To enable us to provide the services of Modrinth, you hereby grant us
          a worldwide, non-exclusive, royalty-free, and unrestricted license to
          use, reproduce, distribute copies, prepare derivative works of, or
          display Content in connection with Modrinth in any medium and for any
          purpose (including commercial purposes).
        </li>
      </ul>

      <p>
        All Content on Modrinth must obey the
        <nuxt-link to="/legal/rules">Content Rules</nuxt-link>. Please be aware
        of these Rules before uploading any Content to Modrinth.
      </p>

      <h2>8. License</h2>

      <p>
        As a user of Modrinth, you have certain irrevocable rights regarding the
        source code of Modrinth's website under the terms of the GNU Affero
        General Public License. Please refer to the
        <a href="https://github.com/modrinth/knossos/blob/master/LICENSE.md"
          >license</a
        >
        governing Modrinth's code, which does not cover its branding, naming, or
        trademarks.
      </p>

      <p>
        For all purposes other than the source code, the use license in section
        8.1 shall apply.
      </p>

      <p>
        Content on our Website is uploaded by our users. Modrinth does not claim
        any ownership over user-uploaded Content, nor do we provide any warranty
        whatsoever regarding this Content. Thus, the owners of a relevant piece
        of Content may provide their own use license for their Content. In
        addition to but not as a replacement for that use license, the use
        license in section 8.1 applies. No use license for Content on Modrinth
        may take away permissions granted by our use license, but they may
        provide additional permissions.
      </p>

      <h3>8.1. Use License</h3>

      <p>
        Permission is granted to temporarily download one copy of the materials
        on our Website for personal, non-commercial transitory viewing only.
        This is the grant of a license, and not a transfer of title. Under this
        license you may not:
      </p>

      <ul>
        <li>modify or copy the materials;</li>
        <li>
          use the materials for any commercial purpose or for any public
          display;
        </li>
        <li>
          attempt to reverse engineer any software downloaded from our Website;
        </li>
        <li>
          remove any copyright or other proprietary notations from the
          materials; or
        </li>
        <li>
          transfer the materials to another person or "mirror" the materials on
          any other server.
        </li>
      </ul>

      <p>
        We may terminate this Use License upon violations of any of these
        restrictions. Upon termination, your viewing right will also be
        terminated and you should destroy any downloaded materials in your
        possession whether it is printed or electronic format.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  head: {
    title: 'Terms - Modrinth',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          'The Terms and Conditions of Modrinth, an open source modding platform focused on Minecraft.',
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'Terms and Conditions',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Terms and Conditions',
      },
      {
        hid: 'og:url',
        name: 'og:url',
        content: `https://modrinth.com/legal/terms`,
      },
    ],
  },
}
</script>

<style lang="scss" scoped>
.main {
  margin: var(--spacing-card-sm) auto;
  max-width: 800px;
}

a {
  text-decoration: underline;
  color: var(--color-link);
}
</style>
