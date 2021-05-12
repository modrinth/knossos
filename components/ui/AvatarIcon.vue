<template>
  <div class="avatar-icon">
    <svg
      class="icon"
      viewBox="0 0 420 420"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        stroke-miterlimit: 2;
      "
    >
      <g transform="matrix(1,0,0,1,-27.4575,-27.4575)">
        <g v-if="notifCount > 0">
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M274.336,443.415C262.254,445.595 249.805,446.729 237.093,446.729C121.392,446.729 27.458,352.794 27.458,237.093C27.458,121.392 121.392,27.458 237.093,27.458C352.794,27.458 446.729,121.392 446.729,237.093C446.729,246.73 446.077,256.215 444.812,265.504C396.923,242.861 337.671,251.552 297.789,291.434C256.514,332.709 248.647,394.729 274.336,443.415Z"
            style="fill: rgb(235, 235, 235)"
          />
          <clipPath id="_clip1">
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M274.336,443.415C262.254,445.595 249.805,446.729 237.093,446.729C121.392,446.729 27.458,352.794 27.458,237.093C27.458,121.392 121.392,27.458 237.093,27.458C352.794,27.458 446.729,121.392 446.729,237.093C446.729,246.73 446.077,256.215 444.812,265.504C396.923,242.861 337.671,251.552 297.789,291.434C256.514,332.709 248.647,394.729 274.336,443.415Z"
            />
          </clipPath>
          <g clip-path="url(#_clip1)">
            <g transform="matrix(0.911459,0,0,0.911459,27.4575,27.4575)">
              <image
                width="460px"
                height="460px"
                :xlink:href="this.$auth.user.avatar_url"
              />
            </g>
          </g>
        </g>
        <g transform="matrix(1.98438,0,0,1.98438,-149.273,-148.586)">
          <g v-if="notifCount == 0">
            <circle cx="194.703" cy="194.357" r="105.643" style="fill: white" />
            <clipPath id="_clip3">
              <circle cx="194.703" cy="194.357" r="105.643" />
            </clipPath>
            <g clip-path="url(#_clip3)">
              <g transform="matrix(0.459316,0,0,0.459316,89.0606,88.7145)">
                <image
                  width="460px"
                  height="460px"
                  :xlink:href="this.$auth.user.avatar_url"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
    <div
      v-if="notifCount > 0"
      class="bubble"
      :class="{ smaller: notifCount > 9, smallest: notifCount > 99 }"
    >
      {{ displayNotifCount }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvatarIcon',
  props: {
    notifCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    displayNotifCount() {
      return this.notifCount < 100 ? this.notifCount : '99+'
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-icon {
  position: relative;
  height: 2rem;
  width: 2rem;
  margin-left: 0.5rem;
  margin-right: 0.25rem;

  .icon {
    height: 100%;
    width: 100%;
  }

  .bubble {
    position: absolute;
    bottom: -0.2rem;
    right: -0.2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #e02914;
    color: white;
    border-radius: 100%;
    width: 0.9rem;
    height: 0.9rem;
    font-size: 0.6rem;

    &.smaller {
      font-size: 0.5rem;
    }
    &.smallest {
      font-size: 0.4rem;
    }
  }
}
</style>
