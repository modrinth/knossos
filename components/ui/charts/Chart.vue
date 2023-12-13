<script setup>
import dayjs from 'dayjs'
import { Button, DownloadIcon, UpdatedIcon, formatNumber, formatMoney } from 'omorphia'

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  formatLabels: {
    type: Function,
    default: (label) => dayjs(label).format('MMM D'),
  },
  colors: {
    type: Array,
    default: () => [
      'var(--color-brand)',
      'var(--color-blue)',
      'var(--color-purple)',
      'var(--color-red)',
      'var(--color-orange)',
    ],
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  hideToolbar: {
    type: Boolean,
    default: false,
  },
  hideLegend: {
    type: Boolean,
    default: false,
  },
  stacked: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'bar',
  },
  hideTotal: {
    type: Boolean,
    default: false,
  },
  isMoney: {
    type: Boolean,
    default: false,
  },
  legendPosition: {
    type: String,
    default: 'right',
  },
  xAxisType: {
    type: String,
    default: 'datetime',
  },
  percentStacked: {
    type: Boolean,
    default: false,
  },
  horizontalBar: {
    type: Boolean,
    default: false,
  },
  disableAnimations: {
    type: Boolean,
    default: false,
  },
})

const chartOptions = ref({
  chart: {
    id: props.name,
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Roboto, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    foreColor: 'var(--color-base)',
    selection: {
      enabled: true,
      fill: {
        color: 'var(--color-brand)',
      },
    },
    toolbar: {
      show: false,
    },
    stacked: props.stacked,
    stackType: props.percentStacked ? '100%' : 'normal',
    zoom: {
      autoScaleYaxis: true,
    },
    animations: {
      enabled: props.disableAnimations,
    },
  },
  xaxis: {
    type: props.xAxisType,
    categories: props.labels,
    labels: {
      style: {
        borderRadius: 'var(--radius-sm)',
      },
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    tooltip: {
      enabled: false,
    },
  },
  colors: props.colors,
  dataLabels: {
    enabled: false,
    background: {
      enabled: true,
      borderRadius: 20,
    },
  },
  grid: {
    borderColor: 'var(--color-button-bg)',
    tickColor: 'var(--color-button-bg)',
  },
  legend: {
    show: !props.hideLegend,
    position: props.legendPosition,
    showForZeroSeries: false,
    fontSize: 'var(--font-size-nm)',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Roboto, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
  markers: {
    size: 0,
    strokeColor: 'var(--color-contrast)',
    strokeWidth: 3,
    strokeOpacity: 1,
    fillOpacity: 1,
    hover: {
      size: 6,
    },
  },
  plotOptions: {
    bar: {
      horizontal: props.horizontalBar,
      columnWidth: '80%',
      endingShape: 'rounded',
      borderRadius: 5,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const label = w.globals.lastXAxis.categories[dataPointIndex]
      const formattedLabel = props.formatLabels(label)

      return (
        '<div class="bar-tooltip">' +
        '<div class="seperated-entry title">' +
        '<div class="label">' +
        formattedLabel +
        '</div>' +
        (props.hideTotal
          ? ''
          : props.percentStacked
          ? `
        <div class="value">
          ${props.prefix}
          ${formatNumber(
            Math.trunc(
              ((100 * series[seriesIndex][dataPointIndex]) /
                series.reduce((a, b) => a + b[dataPointIndex], 0)) *
                100
            ) / 100
          )}%
          ${props.suffix}
        </div>`
          : `<div class="value">
        ${props.prefix}
        ${
          props.isMoney
            ? formatMoney(
                series.reduce((a, b) => a + b[dataPointIndex], 0),
                false
              )
            : formatNumber(
                series.reduce((a, b) => a + b[dataPointIndex], 0),
                false
              )
        }
        ${props.suffix}
        </div>`) +
        '</div><hr class="card-divider" />' +
        (props.percentStacked
          ? `<div class="list-entry">
            <span class="circle" style="background-color: ${w.globals.colors[seriesIndex]}"> </span>
            <div class="label">
              ${w.globals.seriesNames[seriesIndex]}
            </div>
            <div class="value">
              ${props.prefix}
              ${
                props.isMoney
                  ? formatMoney(series[seriesIndex][dataPointIndex], false)
                  : formatNumber(series[seriesIndex][dataPointIndex], false)
              }
              ${props.suffix}
            </div>
          </div>`
          : series
              .map((value, index) => [
                value[dataPointIndex],
                `<div class="list-entry">
                <span class="circle" style="background-color: ${w.globals.colors[index]}"> </span>
                <div class="label">
                  ${w.globals.seriesNames[index]}
                </div>
                <div class="value">
                  ${props.prefix}
                  ${
                    props.isMoney
                      ? formatMoney(value[dataPointIndex], false)
                      : formatNumber(value[dataPointIndex], false)
                  }
                  ${props.suffix}
                </div>
              </div>`,
              ])
              .filter((value) => value[0] > 0)
              .sort((a, b) => b[0] - a[0])
              .map((value) => value[1])
              .reduce((a, b) => a + b)) +
        '</div>'
      )
    },
  },
})

const fillOptions = {
  colors: props.colors,
  type: 'gradient',
  opacity: 1,
  gradient: {
    shade: 'light',
    type: 'vertical',
    shadeIntensity: 0,
    gradientToColors: props.colors,
    inverseColors: true,
    opacityFrom: 0.5,
    opacityTo: 0,
    stops: [0, 100],
    colorStops: [],
  },
}

const chart = ref(null)

const legendValues = ref(
  [...props.data].map((project, index) => {
    return { name: project.name, visible: true, color: props.colors[index] }
  })
)

const flipLegend = (legend, newVal) => {
  legend.visible = newVal
  chart.value.toggleSeries(legend.name)
}

const downloadCSV = () => {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    'Date,' +
    props.labels.join(',') +
    '\n' +
    props.data
      .map((project) => project.name.replace(',', '-') + ',' + project.data.join(','))
      .reduce((a, b) => a + '\n' + b)

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${props.name}.csv`)
  document.body.appendChild(link) // Required for FF

  link.click()
}

const resetChart = () => {
  chart.value.updateSeries([...props.data])
  chart.value.updateOptions({
    xaxis: {
      categories: props.labels,
    },
    colors: props.colors,
  })
  chart.value.resetSeries()
  legendValues.value.forEach((legend) => {
    legend.visible = true
  })
}

defineExpose({
  resetChart,
  downloadCSV,
  flipLegend,
})
</script>

<template>
  <div class="bar-chart">
    <div class="title-bar">
      <slot />
      <div v-if="!hideToolbar" class="toolbar">
        <Button v-tooltip="'Download data as CSV'" icon-only @click="downloadCSV">
          <DownloadIcon />
        </Button>
        <Button v-tooltip="'Reset chart'" icon-only @click="resetChart">
          <UpdatedIcon />
        </Button>
        <slot name="toolbar" />
      </div>
    </div>
    <VueApexCharts
      ref="chart"
      :type="type"
      :options="{
        ...chartOptions,
        fill: type === 'area' ? fillOptions : {},
      }"
      :series="data"
      class="chart"
    />
  </div>
</template>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
}

svg {
  width: 100%;
  height: 100%;
}

.btn {
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.bar-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--gap-xs);
}

.toolbar {
  display: flex;
  flex-direction: row;
  gap: var(--gap-xs);
  z-index: 1;
  margin-left: auto;
}

:deep(.apexcharts-menu),
:deep(.apexcharts-tooltip),
:deep(.apexcharts-yaxistooltip) {
  background: var(--color-raised-bg) !important;
  border-radius: var(--radius-sm) !important;
  border: 1px solid var(--color-button-bg) !important;
  box-shadow: var(--shadow-floating) !important;
  font-size: var(--font-size-nm) !important;
}

:deep(.apexcharts-grid-borders) {
  line {
    stroke: var(--color-button-bg) !important;
  }
}

:deep(.apexcharts-yaxistooltip),
:deep(.apexcharts-xaxistooltip) {
  background: var(--color-raised-bg) !important;
  border-radius: var(--radius-sm) !important;
  border: 1px solid var(--color-button-bg) !important;
  font-size: var(--font-size-nm) !important;
  color: var(--color-base) !important;

  .apexcharts-xaxistooltip-text {
    font-size: var(--font-size-nm) !important;
    color: var(--color-base) !important;
  }
}

:deep(.apexcharts-yaxistooltip-left:after) {
  border-left-color: var(--color-raised-bg) !important;
}

:deep(.apexcharts-yaxistooltip-left:before) {
  border-left-color: var(--color-button-bg) !important;
}

:deep(.apexcharts-xaxistooltip-bottom:after) {
  border-bottom-color: var(--color-raised-bg) !important;
}

:deep(.apexcharts-xaxistooltip-bottom:before) {
  border-bottom-color: var(--color-button-bg) !important;
}

:deep(.apexcharts-menu-item) {
  border-radius: var(--radius-sm) !important;
  padding: var(--gap-xs) var(--gap-sm) !important;

  &:hover {
    transition: all 0.3s !important;
    color: var(--color-accent-contrast) !important;
    background: var(--color-brand) !important;
  }
}

:deep(.apexcharts-tooltip) {
  .bar-tooltip {
    min-width: 10rem;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding: var(--gap-sm);

    .card-divider {
      margin: var(--gap-xs) 0;
    }

    .seperated-entry {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      font-weight: bolder;
    }

    .label {
      margin-right: var(--gap-xl);
      color: var(--color-contrast);
    }

    .value {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--gap-xs);
      color: var(--color-base);
    }

    .list-entry {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: var(--font-size-sm);

      .value {
        margin-left: auto;
      }
    }

    .circle {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      display: inline-block;
      margin-right: var(--gap-sm);
      border: 2px solid var(--color-base);
    }

    svg {
      height: 1em;
      width: 1em;
    }
  }
}

.legend {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: var(--gap-lg);
  justify-content: center;
}

:deep(.checkbox) {
  white-space: nowrap;
}

.legend-checkbox :deep(.checkbox.checked) {
  background-color: var(--color);
}
</style>
