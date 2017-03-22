<template>
<div id="prob">
  <div class="ui right aligned basic segment">
    <div class="ui statistic">
      <div class="value">{{ `${showId}/${store.problems.length}` }}</div>
    </div>
  </div>
  <div class="ui segment" v-if="page === 0">
    <img class="ui fluid rounded image" :src="`./static/${prob.source}`">
    <div class="ui right aligned basic segment">
      <button class="ui blue basic button" @click="addPage">作答</button>
    </div>
  </div>
  <div class="ui segment" v-else-if="page === 1">
    <h1 class="ui header">作答</h1>
    <div class="ui four column grid basic segment">
      <div class="column" v-for="s in prob.selections">
        <div class="ui large radio checkbox">
          <input type="radio"
            :name="idx"
            :value="s"
            v-model="pack.select"
            @change="updateSelect">
          <label>{{ store.options[s] }}</label>
        </div>
      </div>
    </div>
    <div v-show="pack.select >= 0" class="ui right aligned basic segment">
      <button class="ui blue basic button" @click="addPage">難易度</button>
    </div>
  </div>
  <div class="ui segment" v-else>
    <div class="ui huge header">
      <div class="content">
        難易度
        <div class="sub header">1 最簡單，5 最難</div>
      </div>
    </div>
    <div class="ui five column grid basic segment">
      <div class="column" v-for="s in lvl">
        <div class="ui large radio checkbox">
          <input type="radio"
            :name="`s${idx}`"
            :value="s"
            v-model="pack.level"
            @change="updateLevel">
          <label>{{ s }}</label>
        </div>
      </div>
    </div>
    <div v-show="pack.level > 0" class="ui right aligned basic segment">
      <router-link
        v-if="showId < store.problems.length"
        :to="`/prob/${showId + 1}`"
        class="ui basic green button">下一題</router-link>
      <router-link
        v-else
        to="/end"
        class="ui basic orange button">結束</router-link>
    </div>
  </div>
</div>
</template>

<script>
import _      from 'lodash'
import moment from 'moment'

const format = 'HH:mm:ss.SSS'
/**
 *  Return specified format of time
 *  @return {string}
 */
const myDate = () => moment(new Date()).format(format)
/**
 *  Return seconds between two date
 *  @param {moment} d1
 *  @param {moment} d2
 *  @return {number} d1 - d2
 */
const diffDate = (d1, d2) => {
  let diff = moment(d1, format) - moment(d2, format)
  window.console.log(diff)
  if (diff < 0)
    diff += moment.duration(1, 'days')
  return moment.duration(diff).asSeconds()
}

window.moment = moment

const lvl = [1, 2, 3, 4, 5]

export default {
  name: 'prob',
  props: [ 'store' ],
  data() {
    return {
      lvl:  lvl,
      page: 0,
      pack: {
        select: -1,
        level:  -1,
        start:  '',
        middle: '',
        end:    ''
      }
    }
  },
  /**
   *  Update data when mounted
   */
  mounted() {
    this.updateData()
  },
  watch: {
    /**
     *  Track dynamic routes and refresh data
     */
    '$route' (to, from) {
      this.updateData()
    }
  },
  computed: {
    /**
     *  Public Id
     */
    showId() {
      return parseInt(this.$route.params.id)
    },
    /**
     *  Index for store.problems and store.check
     */
    idx() {
      return this.showId - 1
    },
    /**
     *  Problem information for current index
     */
    prob() {
      const app = this
      return app.store.problems[app.idx]
    }
  },
  methods: {
    /**
     *
     */
    addPage() {
      this.page ++
    },
    /**
     *  Refresh data
     */
    updateData() {
      const app = this
      _.assign(app.$data, {
        page: 0,
        pack: {
          select: -1,
          level:  -1,
          start:  myDate(),
          middle: '',
          end:    ''
        }
      })
    },
    /**
     *  Emit 'write_check' event
     */
    updateSelect() {
      const app     = this
      const current = myDate()
      const diff    = diffDate(current, app.$data.pack.start)
      _.assign(app.$data.pack, {
        middle:     current,
        diffMiddle: diff
      })
      app.$root.$emit('write_check', app.idx, app.$data.pack)
    },
    /**
     */
    updateLevel() {
      const app     = this
      const current = myDate()
      const diff    = diffDate(current, app.$data.pack.middle)
      _.assign(app.$data.pack, {
        end:     current,
        diffEnd: diff
      })
      app.$root.$emit('write_check', app.idx, app.$data.pack)
    }
  }
}
</script>