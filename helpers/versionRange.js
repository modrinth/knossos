const EXACT_VERSION = /^=?(\d+)\.(\d+)(?:\.(\d+))?$/
const TILDE_VERSION = /^~(\d+)\.(\d+)(?:\.(\d+))?$/
const CARET_VERSION = /^\^(\d+)\.(\d+)(?:\.(\d+))?$/
const GREATER_VERSION = /^>=?(\d+)\.(\d+)(?:\.(\d+))?$/
const LESS_VERSION = /^<=?(\d+)\.(\d+)(?:\.(\d+))?$/
const MAJOR_X = /^(\d+)\.[xX*](?:\.[xX*])?$/
const MINOR_X = /^(\d+)\.(\d+)\.[xX*]$/

// This is a very basic implementation of semver range parsing
// TODO: This does not handle accurate semver parsing.
//       Does not handle hyphen ranges, comparator sets, or disjunctions
//       Does not handle X ranges inside of tilde or caret ranges
export class VersionRange {
  constructor(range) {
    if (range === '*' || range === '' || range === 'x' || range === 'X') {
      this.tester = () => true
      this.result = ['0.0.0', '0', '0', '0']
    } else if (range.match(EXACT_VERSION)) {
      this.tester = (version) =>
        version[0] === this.version[0] &&
        version[1] === this.version[1] &&
        version[2] === this.version[2]
      this.result = range.match(EXACT_VERSION)
    } else if (range.match(CARET_VERSION)) {
      this.tester = (version) =>
        version[0] === this.version[0] &&
        version[1] >= this.version[1] &&
        version[2] >= this.version[2]
      this.result = range.match(CARET_VERSION)
    } else if (range.match(TILDE_VERSION)) {
      this.tester = (version) =>
        version[0] === this.version[0] &&
        version[1] === this.version[1] &&
        version[2] >= this.version[2]
      this.result = range.match(TILDE_VERSION)
    } else if (range.match(GREATER_VERSION)) {
      const common = (version) =>
        version[0] > this.version[0] ||
        (version[0] === this.version[0] && version[1] > this.version[1])
      if (range[1] === '=') {
        this.tester = (version) =>
          common(version) ||
          (version[0] === this.version[0] &&
            version[1] === this.version[1] &&
            version[2] >= this.version[2])
      } else {
        this.tester = (version) =>
          common(version) ||
          (version[0] === this.version[0] &&
            version[1] === this.version[1] &&
            version[2] > this.version[2])
      }
      this.result = range.match(GREATER_VERSION)
    } else if (range.match(LESS_VERSION)) {
      const common = (version) =>
        version[0] < this.version[0] ||
        (version[0] === this.version[0] && version[1] < this.version[1])
      if (range[1] === '=') {
        this.tester = (version) =>
          common(version) ||
          (version[0] === this.version[0] &&
            version[1] === this.version[1] &&
            version[2] <= this.version[2])
      } else {
        this.tester = (version) =>
          common(version) ||
          (version[0] === this.version[0] &&
            version[1] === this.version[1] &&
            version[2] < this.version[2])
      }
      this.result = range.match(LESS_VERSION)
    } else if (range.match(MAJOR_X)) {
      this.tester = (version) => version[0] === this.version[0]
      this.result = range.match(MAJOR_X)
    } else if (range.match(MINOR_X)) {
      this.tester = (version) => version[0] === this.version[0] && version[1] === this.version[1]
      this.result = range.match(MINOR_X)
    }

    if (this.result) {
      this.version = [
        this.result[1] ? Number.parseInt(this.result[1], 10) : 0, // major
        this.result[2] ? Number.parseInt(this.result[2], 10) : 0, // minor
        this.result[3] ? Number.parseInt(this.result[3], 10) : 0, // patch
      ]
    }
  }

  test(versionString) {
    if (!versionString) return false
    const matchedVersion = versionString.match(EXACT_VERSION)
    if (!matchedVersion || !this.result || !this.version) return false
    return this.tester([
      matchedVersion[1] ? Number.parseInt(matchedVersion[1], 10) : 0, // major
      matchedVersion[2] ? Number.parseInt(matchedVersion[2], 10) : 0, // minor
      matchedVersion[3] ? Number.parseInt(matchedVersion[3], 10) : 0, // patch
    ])
  }
}
