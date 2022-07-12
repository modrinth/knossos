<template>
  <div class="main">
    <div class="card">
      <h1>Privacy Policy</h1>

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

      <h2>1. About this Policy</h2>

      <p>
        At Modrinth, one of our main priorities is the privacy of our visitors.
        This Privacy Policy document contains types of information that is
        collected and recorded by Modrinth and how we use it.
      </p>

      <p>
        This Privacy Policy applies only to our online activities and is valid
        for visitors to our website with regards to the information that they
        share and/or collect in Modrinth. This policy is not applicable to any
        information collected offline or via channels other than this website.
      </p>

      <p>
        If you have additional questions or require more information about our
        Privacy Policy, do not hesitate to contact us at admin@modrinth.com.
      </p>

      <h2>2. General Data Protection Regulation (GDPR)</h2>

      <p>
        We are a
        <a
          href="https://ec.europa.eu/info/law/law-topic/data-protection/reform/rules-business-and-organisations/obligations/controller-processor/what-data-controller-or-data-processor_en"
          >controller of your information</a
        >.
      </p>

      <p>
        Our legal basis for collecting and using the personal information
        described in this Privacy Policy depends on the Personal Information we
        collect and the specific context in which we collect the information:
      </p>
      <ul>
        <li>We need to perform a contract with you</li>
        <li>You have given us permission to do so</li>
        <li>
          Processing your personal information is in our legitimate interests
        </li>
        <li>We need to comply with the law</li>
      </ul>

      <p>
        We will retain your personal information only for as long as is
        necessary for the purposes set out in this Privacy Policy. We will
        retain and use your information to the extent necessary to comply with
        our legal obligations, resolve disputes, and enforce our policies.
      </p>

      <p>
        If you are a resident of the European Economic Area (EEA), you have
        certain data protection rights. If you wish to be informed what Personal
        Information we hold about you or if you want your Personal Information
        to be removed from our systems, please contact us at admin@modrinth.com.
      </p>

      <p>
        In certain circumstances, you have the following data protection rights:
      </p>
      <ul>
        <li>
          The right to access, update, or delete the information we have on you.
        </li>
        <ul>
          <li>To exercise this right, please email admin@modrinth.com.</li>
        </ul>
        <li>The right of rectification.</li>
        <li>The right to object.</li>
        <li>The right of restriction.</li>
        <li>The right to data portability</li>
        <li>The right to withdraw consent</li>
      </ul>

      <h2>3. Log files</h2>

      <p>
        Modrinth follows a standard procedure of using log files. These files
        log visitors when they visit websites. All hosting companies do this and
        a part of hosting services' analytics. The information collected by log
        files include internet protocol (IP) addresses, browser type, Internet
        Service Provider (ISP), date and time stamp, referring/exit pages, and
        possibly the number of clicks. These are not linked to any information
        that is personally identifiable. The purpose of the information is for
        analyzing trends, administering the site, tracking users' movement on
        the website, and gathering demographic information.
      </p>

      <h2>4. Cookies and web beacons</h2>

      <p>
        Like any other website, Modrinth uses 'cookies'. These cookies are used
        to store information including visitors' preferences, and the pages on
        the website that the visitor accessed or visited. The information is
        used to optimize the users' experience by customizing our web page
        content based on visitors' browser type and/or other information.
      </p>

      <p>
        For more general information on cookies, please read
        <a href="https://www.privacypolicies.com/blog/cookies/"
          >"What Are Cookies"</a
        >.
      </p>

      <h2>5. Additional privacy policies</h2>

      <p>
        Third-party ad servers or ad networks uses technologies like cookies,
        JavaScript, or Web Beacons that are used in their respective
        advertisements and links that appear on Modrinth, which are sent
        directly to users' browser. They automatically receive your IP address
        when this occurs. These technologies are used to measure the
        effectiveness of their advertising campaigns and/or to personalize the
        advertising content that you see on websites that you visit.
      </p>

      <p>
        Note that Modrinth has no access to or control over these cookies that
        are used by third-party advertisers.
      </p>

      <p>
        This Privacy Policy does not apply to other advertisers or websites.
        Thus, we advise you to consult the respective Privacy Policies of any
        third-party ad servers for more detailed information. It may include
        their practices and instructions about how to opt-out of certain
        options.
      </p>

      <p>
        You can choose to disable cookies through your individual browser
        options. Please consult the guides available for your web browser to
        find more detailed information about cookie management.
      </p>

      <h2>6. Children's information</h2>

      <p>
        Another part of our goal is to add protection for children who are using
        our Website. We encourage parents and guardians to observe, monitor, and
        guide their children's online activity.
      </p>

      <p>
        Modrinth does not knowingly collect any Personal Identifiable
        Information (PII) from children under the age of 13. If you think that
        your child provided this kind of information on our website, we strongly
        encourage you to contact us immediately at admin@modrinth.com, after
        which we will promptly remove any such information from our records on a
        best-effort basis.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  head: {
    title: 'Privacy - Modrinth',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          'The privacy policy of Modrinth, an open source modding platform focused on Minecraft.',
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'Privacy Policy',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Privacy Policy',
      },
      {
        hid: 'og:url',
        name: 'og:url',
        content: `https://modrinth.com/legal/privacy`,
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
