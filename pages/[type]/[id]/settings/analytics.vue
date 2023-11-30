<script setup>
import {Button, Card, formatMoney, formatNumber, HistoryIcon, Modal, UpdatedIcon, PageBar } from 'omorphia';
import CompactChart from "~/components/ui/charts/CompactChart.vue";
import dayjs from "dayjs";
import CalendarClockIcon from "assets/images/utils/calendar-clock.svg";

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
})

const totalData = ref({
  downloads: 0,
  pageViews: 0,
  revenue: 0,
})

const countryNames = shallowRef({
  "ad": "Andorra",
  "ae": "United Arab Emirates",
  "af": "Afghanistan",
  "ag": "Antigua and Barbuda",
  "ai": "Anguilla",
  "al": "Albania",
  "am": "Armenia",
  "ao": "Angola",
  "aq": "Antarctica",
  "ar": "Argentina",
  "as": "American Samoa",
  "at": "Austria",
  "au": "Australia",
  "aw": "Aruba",
  "ax": "Åland Islands",
  "az": "Azerbaijan",
  "ba": "Bosnia and Herzegovina",
  "bb": "Barbados",
  "bd": "Bangladesh",
  "be": "Belgium",
  "bf": "Burkina Faso",
  "bg": "Bulgaria",
  "bh": "Bahrain",
  "bi": "Burundi",
  "bj": "Benin",
  "bl": "Saint Barthélemy",
  "bm": "Bermuda",
  "bn": "Brunei",
  "bo": "Bolivia",
  "bq": "Caribbean Netherlands",
  "br": "Brazil",
  "bs": "Bahamas",
  "bt": "Bhutan",
  "bv": "Bouvet Island",
  "bw": "Botswana",
  "by": "Belarus",
  "bz": "Belize",
  "ca": "Canada",
  "cc": "Cocos (Keeling) Islands",
  "cd": "DR Congo",
  "cf": "Central African Republic",
  "cg": "Republic of the Congo",
  "ch": "Switzerland",
  "ci": "Côte d'Ivoire (Ivory Coast)",
  "ck": "Cook Islands",
  "cl": "Chile",
  "cm": "Cameroon",
  "cn": "China",
  "co": "Colombia",
  "cr": "Costa Rica",
  "cu": "Cuba",
  "cv": "Cape Verde",
  "cw": "Curaçao",
  "cx": "Christmas Island",
  "cy": "Cyprus",
  "cz": "Czechia",
  "de": "Germany",
  "dj": "Djibouti",
  "dk": "Denmark",
  "dm": "Dominica",
  "do": "Dominican Republic",
  "dz": "Algeria",
  "ec": "Ecuador",
  "ee": "Estonia",
  "eg": "Egypt",
  "eh": "Western Sahara",
  "er": "Eritrea",
  "es": "Spain",
  "et": "Ethiopia",
  "eu": "European Union",
  "fi": "Finland",
  "fj": "Fiji",
  "fk": "Falkland Islands",
  "fm": "Micronesia",
  "fo": "Faroe Islands",
  "fr": "France",
  "ga": "Gabon",
  "gb": "United Kingdom",
  "gb-eng": "England",
  "gb-nir": "Northern Ireland",
  "gb-sct": "Scotland",
  "gb-wls": "Wales",
  "gd": "Grenada",
  "ge": "Georgia",
  "gf": "French Guiana",
  "gg": "Guernsey",
  "gh": "Ghana",
  "gi": "Gibraltar",
  "gl": "Greenland",
  "gm": "Gambia",
  "gn": "Guinea",
  "gp": "Guadeloupe",
  "gq": "Equatorial Guinea",
  "gr": "Greece",
  "gs": "South Georgia",
  "gt": "Guatemala",
  "gu": "Guam",
  "gw": "Guinea-Bissau",
  "gy": "Guyana",
  "hk": "Hong Kong",
  "hm": "Heard Island and McDonald Islands",
  "hn": "Honduras",
  "hr": "Croatia",
  "ht": "Haiti",
  "hu": "Hungary",
  "id": "Indonesia",
  "ie": "Ireland",
  "il": "Israel",
  "im": "Isle of Man",
  "in": "India",
  "io": "British Indian Ocean Territory",
  "iq": "Iraq",
  "ir": "Iran",
  "is": "Iceland",
  "it": "Italy",
  "je": "Jersey",
  "jm": "Jamaica",
  "jo": "Jordan",
  "jp": "Japan",
  "ke": "Kenya",
  "kg": "Kyrgyzstan",
  "kh": "Cambodia",
  "ki": "Kiribati",
  "km": "Comoros",
  "kn": "Saint Kitts and Nevis",
  "kp": "North Korea",
  "kr": "South Korea",
  "kw": "Kuwait",
  "ky": "Cayman Islands",
  "kz": "Kazakhstan",
  "la": "Laos",
  "lb": "Lebanon",
  "lc": "Saint Lucia",
  "li": "Liechtenstein",
  "lk": "Sri Lanka",
  "lr": "Liberia",
  "ls": "Lesotho",
  "lt": "Lithuania",
  "lu": "Luxembourg",
  "lv": "Latvia",
  "ly": "Libya",
  "ma": "Morocco",
  "mc": "Monaco",
  "md": "Moldova",
  "me": "Montenegro",
  "mf": "Saint Martin",
  "mg": "Madagascar",
  "mh": "Marshall Islands",
  "mk": "North Macedonia",
  "ml": "Mali",
  "mm": "Myanmar",
  "mn": "Mongolia",
  "mo": "Macau",
  "mp": "Northern Mariana Islands",
  "mq": "Martinique",
  "mr": "Mauritania",
  "ms": "Montserrat",
  "mt": "Malta",
  "mu": "Mauritius",
  "mv": "Maldives",
  "mw": "Malawi",
  "mx": "Mexico",
  "my": "Malaysia",
  "mz": "Mozambique",
  "na": "Namibia",
  "nc": "New Caledonia",
  "ne": "Niger",
  "nf": "Norfolk Island",
  "ng": "Nigeria",
  "ni": "Nicaragua",
  "nl": "Netherlands",
  "no": "Norway",
  "np": "Nepal",
  "nr": "Nauru",
  "nu": "Niue",
  "nz": "New Zealand",
  "om": "Oman",
  "pa": "Panama",
  "pe": "Peru",
  "pf": "French Polynesia",
  "pg": "Papua New Guinea",
  "ph": "Philippines",
  "pk": "Pakistan",
  "pl": "Poland",
  "pm": "Saint Pierre and Miquelon",
  "pn": "Pitcairn Islands",
  "pr": "Puerto Rico",
  "ps": "Palestine",
  "pt": "Portugal",
  "pw": "Palau",
  "py": "Paraguay",
  "qa": "Qatar",
  "re": "Réunion",
  "ro": "Romania",
  "rs": "Serbia",
  "ru": "Russia",
  "rw": "Rwanda",
  "sa": "Saudi Arabia",
  "sb": "Solomon Islands",
  "sc": "Seychelles",
  "sd": "Sudan",
  "se": "Sweden",
  "sg": "Singapore",
  "sh": "Saint Helena, Ascension and Tristan da Cunha",
  "si": "Slovenia",
  "sj": "Svalbard and Jan Mayen",
  "sk": "Slovakia",
  "sl": "Sierra Leone",
  "sm": "San Marino",
  "sn": "Senegal",
  "so": "Somalia",
  "sr": "Suriname",
  "ss": "South Sudan",
  "st": "São Tomé and Príncipe",
  "sv": "El Salvador",
  "sx": "Sint Maarten",
  "sy": "Syria",
  "sz": "Eswatini (Swaziland)",
  "tc": "Turks and Caicos Islands",
  "td": "Chad",
  "tf": "French Southern and Antarctic Lands",
  "tg": "Togo",
  "th": "Thailand",
  "tj": "Tajikistan",
  "tk": "Tokelau",
  "tl": "Timor-Leste",
  "tm": "Turkmenistan",
  "tn": "Tunisia",
  "to": "Tonga",
  "tr": "Turkey",
  "tt": "Trinidad and Tobago",
  "tv": "Tuvalu",
  "tw": "Taiwan",
  "tz": "Tanzania",
  "ua": "Ukraine",
  "ug": "Uganda",
  "um": "United States Minor Outlying Islands",
  "un": "United Nations",
  "us": "United States",
  "us-ak": "Alaska",
  "us-al": "Alabama",
  "us-ar": "Arkansas",
  "us-az": "Arizona",
  "us-ca": "California",
  "us-co": "Colorado",
  "us-ct": "Connecticut",
  "us-de": "Delaware",
  "us-fl": "Florida",
  "us-ga": "Georgia",
  "us-hi": "Hawaii",
  "us-ia": "Iowa",
  "us-id": "Idaho",
  "us-il": "Illinois",
  "us-in": "Indiana",
  "us-ks": "Kansas",
  "us-ky": "Kentucky",
  "us-la": "Louisiana",
  "us-ma": "Massachusetts",
  "us-md": "Maryland",
  "us-me": "Maine",
  "us-mi": "Michigan",
  "us-mn": "Minnesota",
  "us-mo": "Missouri",
  "us-ms": "Mississippi",
  "us-mt": "Montana",
  "us-nc": "North Carolina",
  "us-nd": "North Dakota",
  "us-ne": "Nebraska",
  "us-nh": "New Hampshire",
  "us-nj": "New Jersey",
  "us-nm": "New Mexico",
  "us-nv": "Nevada",
  "us-ny": "New York",
  "us-oh": "Ohio",
  "us-ok": "Oklahoma",
  "us-or": "Oregon",
  "us-pa": "Pennsylvania",
  "us-ri": "Rhode Island",
  "us-sc": "South Carolina",
  "us-sd": "South Dakota",
  "us-tn": "Tennessee",
  "us-tx": "Texas",
  "us-ut": "Utah",
  "us-va": "Virginia",
  "us-vt": "Vermont",
  "us-wa": "Washington",
  "us-wi": "Wisconsin",
  "us-wv": "West Virginia",
  "us-wy": "Wyoming",
  "uy": "Uruguay",
  "uz": "Uzbekistan",
  "va": "Vatican City (Holy See)",
  "vc": "Saint Vincent and the Grenadines",
  "ve": "Venezuela",
  "vg": "British Virgin Islands",
  "vi": "United States Virgin Islands",
  "vn": "Vietnam",
  "vu": "Vanuatu",
  "wf": "Wallis and Futuna",
  "ws": "Samoa",
  "xk": "Kosovo",
  "ye": "Yemen",
  "yt": "Mayotte",
  "za": "South Africa",
  "zm": "Zambia",
  "zw": "Zimbabwe"
})

let downloadData, viewData, revenueData, viewsByCountry, downloadsByCountry
const selectedDataType = ref('downloads')
const finishedLoading = ref(false)
const selectedResolution = ref('daily')
const startDate = ref(new Date(new Date() - 30 * 24 * 60 * 60 * 1000))
const customStartDate = ref(null)
const endDate = ref(new Date(new Date() - 24 * 60 * 60 * 1000))
const customEndDate = ref(null)
const markReload = ref(false)
const timeResolution = ref(1440)
const customTimeResolution = ref(null)
const customTimeModal = ref(null)

onMounted(async () => {
  const initialBody = `project_ids=["${props.project.id}"]&start_date=${startDate.value.toISOString()}&end_date=${endDate.value.toISOString()}&resolution_minutes=${timeResolution.value}`
  try {
    ;[
      { data: downloadData },
      { data: viewData },
      { data: revenueData },
      { data: downloadsByCountry },
      { data: viewsByCountry },
    ] = await Promise.all([
      useAsyncData(`analytics/downloads?${initialBody}`, () => useBaseFetch(`analytics/downloads?${initialBody}`), {
        transform: (analytics) => processAnalytics(analytics, (parsedData) => totalData.value.downloads = totalData.value.downloads + parsedData)
      }),
      useAsyncData(`analytics/views?${initialBody}`, () => useBaseFetch(`analytics/views?${initialBody}`), {
        transform: (analytics) => processAnalytics(analytics, (parsedData) => totalData.value.pageViews = totalData.value.pageViews + parsedData)
      }),
      useAsyncData(`analytics/revenue?${initialBody}`, () => useBaseFetch(`analytics/revenue?${initialBody}`), {
        transform: (analytics) => processAnalytics(analytics, (parsedData) => totalData.value.revenue = totalData.value.revenue + parsedData)
      }),
      useAsyncData(`analytics/countries/downloads?${initialBody}`, () => useBaseFetch(`analytics/countries/downloads?${initialBody}`), {
        transform: (analytics) => processCountryData(analytics)
      }),
      useAsyncData(`analytics/countries/views?${initialBody}`, () => useBaseFetch(`analytics/countries/views?${initialBody}`), {
        transform: (analytics) => processCountryData(analytics)
      }),
    ])
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
  } finally {
    finishedLoading.value = true
  }
})

const select = (type) => {
  selectedDataType.value = type
}

const processAnalytics = (analytics, accumulateData) => {
  const labels = []
  const revData = []
  for (const trueData of Object.values(analytics)) {
    for (const [key, value] of Object.entries(trueData)) {
      const parsedData = Math.round(parseFloat(value) * 100) / 100
      accumulateData(parsedData)
      labels.push(dayjs.unix(key).format('YYYY-MM-DD'))
      revData.push(parsedData)
    }
  }
  return {
    labels,
    data: [{
      name: 'Downloads',
      data: revData,
    }]
  }
}

const processCountryData = (analytics) => {
  const data = {
    total: 0,
    data: [],
  }

  const countryData = Object.values(analytics);
  for (const [key, value] of Object.entries(countryData[0])) {
    const parsedData = Math.round(parseFloat(value) * 100) / 100
    data.total = data.total + parsedData
    data.data.push({
      name: key,
      value: parsedData,
    })
  }

  data.data.sort((a, b) => b.value - a.value)

  return data
}

const refetchData = async () => {
  const body = `project_ids=["${props.project.id}"]&start_date=${startDate.value.toISOString()}&end_date=${endDate.value.toISOString()}&resolution_minutes=${timeResolution.value}`
  totalData.value = {
    downloads: 0,
    pageViews: 0,
    revenue: 0,
  }
  try {
    ;[
      { data: downloadData },
      { data: viewData },
      { data: revenueData },
      { data: downloadsByCountry },
      { data: viewsByCountry },
    ] = await Promise.all([
      useAsyncData(`analytics/downloads?${body}`, () => useBaseFetch(`analytics/downloads?${body}`), {
        transform: (analytics) => processAnalytics(analytics, (parsedData) => totalData.value.downloads = totalData.value.downloads + parsedData)
      }),
      useAsyncData(`analytics/views?${body}`, () => useBaseFetch(`analytics/views?${body}`), {
        transform: (analytics) => processAnalytics(analytics, (parsedData) => totalData.value.pageViews = totalData.value.pageViews + parsedData)
      }),
      useAsyncData(`analytics/revenue?${body}`, () => useBaseFetch(`analytics/revenue?${body}`), {
        transform: (analytics) => processAnalytics(analytics, (parsedData) => totalData.value.revenue = totalData.value.revenue + parsedData)
      }),
      useAsyncData(`analytics/countries/downloads?${body}`, () => useBaseFetch(`analytics/countries/downloads?${body}`), {
        transform: (analytics) => processCountryData(analytics)
      }),
      useAsyncData(`analytics/countries/views?${body}`, () => useBaseFetch(`analytics/countries/views?${body}`), {
        transform: (analytics) => processCountryData(analytics)
      }),
    ])
  } catch (err) {
    data.$notify({
      group: 'main',
      title: 'An error occurred',
      text: err,
      type: 'error',
    })
  } finally {
    markReload.value = false
  }
}

const selectResolution = async (resolution) => {
  if (selectedResolution.value !== resolution) {
    selectedResolution.value = resolution
    if (resolution === 'daily') {
      startDate.value = new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
      timeResolution.value = 1440
      endDate.value = new Date(new Date() - 24 * 60 * 60 * 1000)
    } else if (resolution === 'weekly') {
      startDate.value = new Date(new Date() - 3 * 30 * 24 * 60 * 60 * 1000)
      timeResolution.value = 10800
      endDate.value = new Date(new Date() - 24 * 60 * 60 * 1000)
    } else if (resolution === 'monthly') {
      startDate.value = new Date(new Date().getFullYear(), 0, 1)
      timeResolution.value = 43200
      endDate.value = new Date(new Date() - 24 * 60 * 60 * 1000)
    } else if (resolution === 'custom') {
      startDate.value = new Date(customStartDate.value)
    }
    markReload.value = true
    await refetchData()
  }
}

const openCustomModal = () => {
  customStartDate.value = null
  customEndDate.value = null
  customTimeResolution.value = 1440
  customTimeModal.value.show()
}

const applyCustomModal = async () => {
  if (customStartDate.value && timeResolution.value) {
    customTimeModal.value.hide()
    await selectResolution('custom')
  }
}
</script>

<template>
  <Modal ref="customTimeModal" header="Define date range and resolution">
    <div class="modal-body universal-body">
      <label for="start-date">
        <span class="label__title">Start date</span>
      </label>
      <input id="start-date" type="date" v-model="customStartDate" />
      <label for="end-date">
        <span class="label__title">End date</span>
      </label>
      <input id="end-date" type="date" v-model="customEndDate" />
      <label for="data-resolution">
        <span class="label__title">Data resolution</span>
        <span class="label__description">
              The amount of minutes each data point represents.
              <span class="label__subdescription">
                  60 = 1 hour, 1440 = 1 day, 10080 = 1 week, 43200 = 1 month
              </span>
            </span>
      </label>
      <input id="data-resolution" type="number" v-model="customTimeResolution" />
      <div class="input-group push-right">
        <Button color="primary" @click="applyCustomModal" :disabled="!customStartDate || !customTimeResolution || !customEndDate ">
          Apply
        </Button>
      </div>
    </div>
  </Modal>
  <h2>Analytics</h2>
  <div class="markdown-body">
    <p>
      This page shows you the analytics for your project, <strong>{{project.title}}</strong>. You can see the number of downloads, page views and revenue earned for your project,
      as well as the total downloads and page views for {{project.title}} by country.
    </p>
  </div>
  <PageBar v-if="finishedLoading" class="resolution-header">
    <span class="page-bar__title"><HistoryIcon /> Range</span>
    <div class="nav-button button-base" :class="{'router-link-exact-active': selectedResolution === 'daily'}" @click="() => selectResolution('daily')">Last month</div>
    <div class="nav-button button-base" :class="{'router-link-exact-active': selectedResolution === 'weekly'}" @click="() => selectResolution('weekly')">Last quarter</div>
    <div class="nav-button button-base" :class="{'router-link-exact-active': selectedResolution === 'monthly'}" @click="() => selectResolution('monthly')">Last year</div>
    <template #right>
      <div class="nav-button button-base" @click="refetchData"><UpdatedIcon/> Refresh</div>
      <div class="nav-button button-base" :class="{'router-link-exact-active': selectedResolution === 'custom'}" @click="openCustomModal"><CalendarClockIcon /> Custom range</div>
    </template>
  </PageBar>
  <div v-if="finishedLoading && !markReload" class="spark-data">
    <client-only>
      <CompactChart
        title="Biweekly Downloads"
        color="var(--color-brand)"
        :value="formatNumber(totalData.downloads, false)"
        :data="downloadData.data"
        :labels="downloadData.labels"
        suffix="<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' /></svg>"
      />
    </client-only>
    <client-only>
      <CompactChart
        title="Biweekly Page Views"
        color="var(--color-blue)"
        :value="formatNumber(totalData.pageViews, false)"
        :data="viewData.data"
        :labels="viewData.labels"
        suffix="<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>"
      />
    </client-only>
    <client-only>
      <CompactChart
        title="Biweekly Revenue"
        color="var(--color-purple)"
        :value="formatMoney(totalData.revenue, false)"
        :data="revenueData.data"
        :labels="revenueData.labels"
        is-money
      />
    </client-only>
  </div>
  <div v-if="finishedLoading && !markReload" class="country-data">
    <Card class="country-downloads">
      <label>
        <span class="label__title">Downloads by country</span>
      </label>
      <div class="country-values">
        <div class="country-value" v-for="country in downloadsByCountry.data">
          <img :src="`https://flagcdn.com/h240/${country.name.toLowerCase()}.png`" :alt="country.name"/>
          <div class="country-text">
            <span class="country-name">{{ countryNames[country.name.toLowerCase()] }}</span>
            <span class="data-point">{{ formatNumber(country.value) }}</span>
          </div>
          <div class="percentage-bar" v-tooltip="`${Math.round(country.value / downloadsByCountry.total * 10000) / 100}%`">
          <span :style="{ width: `${country.value / downloadsByCountry.total * 100}%`, backgroundColor: 'var(--color-brand)' }"></span>
          </div>
        </div>
      </div>
    </Card>
    <Card class="country-downloads">
      <label>
        <span class="label__title">Page views by country</span>
      </label>
      <div class="country-values">
        <div class="country-value" v-for="country in viewsByCountry.data">
          <img :src="`https://flagcdn.com/h240/${country.name.toLowerCase()}.png`" width="64" height="48" :alt="country.name"/>
          <div class="country-text">
            <span class="country-name">{{ countryNames[country.name.toLowerCase()] }}</span>
            <span class="data-point">{{ formatNumber(country.value) }}</span>
          </div>
          <div class="percentage-bar" v-tooltip="`${Math.round(country.value / viewsByCountry.total * 10000) / 100}%`">
            <span :style="{ width: `${country.value / viewsByCountry.total * 100}%`, backgroundColor: 'var(--color-blue)' }"></span>
          </div>
        </div>
      </div>
    </Card>
  </div>
  <BrandLogoAnimated v-else />
</template>

<style scoped lang="scss">
.data-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-raised-bg);
  width: 100%;
  padding: var(--gap-lg);
}

.tabs {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
}

.line-chart {
  width: 100%;
  background-color: var(--color-bg);
  padding: var(--gap-xl);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.bar-graph {
  width: 100%;
  background-color: var(--color-bg);
  padding: var(--gap-xl);
  border-radius: var(--radius-lg);
}

.spark-data {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--gap-md);
}

.country-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-md);
}

.country-values {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-button-bg);
  gap: var(--gap-md);
  padding: var(--gap-md);
  margin-top: var(--gap-md);
  overflow-y: auto;
  max-height: 24rem;
}

.country-value {
  display: grid;
  grid-template-areas: "flag text bar";
  grid-template-columns: auto 10rem 1fr;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--gap-sm);

  img {
    grid-area: flag;
    object-fit: fill;
    width: 4rem;
    height: 2.4rem;
  }

  .country-text {
    grid-area: text;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .percentage-bar {
    grid-area: bar;
    width: 100%;
    height: 1rem;
    background-color: var(--color-raised-bg);
    border: 1px solid var(--color-button-bg);
    border-radius: var(--radius-sm);
    overflow: hidden;

    span {
      display: block;
      height: 100%;
    }
  }
}

.markdown-body {
  margin-bottom: var(--gap-md);
}
</style>
