<template>
<div id="end" class="ui basic segment">
<template v-if="store.result">
  <table class="ui definition celled table">
    <thead><tr>
      <th></th>
      <th>結果</th>
      <th v-for="f in fields">{{ f.name }}</th>
    </tr></thead>
    <tbody>
      <tr v-for="(row, i) in store.result">
        <td>{{ i + 1 }}</td>
        <td class="positive" v-if="row.ok">
          <i class="icon checkmark"></i> 正確
        </td>
        <td class="negative" v-else>
          <i class="icon close"></i> 錯誤
        </td>
        <td v-for="f in fields">{{ row[f.attr] }}</td>
      </tr>
    </tbody>
  </table>
  <div class="ui basic center aligned segment">
    <button class="ui green button"
      @click="downloadTableHandler">下載表格</button>
    <router-link to="/" class="ui blue button">結束</router-link>
  </div>
</template>
</div>
</template>

<script>
import _    from 'lodash'
import $    from 'jquery'
import util from '../scripts/util'

const fields = [
  { name: '選擇',          attr: 'select' },
  { name: '答案',          attr: 'answer' },
  { name: '開始時間',      attr: 'start'  },
  { name: '結束時間',      attr: 'end'    },
  { name: '時間間隔 (秒)', attr: 'diff'   }
]

export default {
  name: 'end',
  props: [ 'store' ],
  data() {
    return {
      fields: fields
    }
  },
  /**
   *  Emit 'upload_answer' event
   */
  created() {
    this.$root.$emit('upload_answer')
  },
  methods: {
    downloadTableHandler() {
      const app  = this
      const data = _.map(
        app.store.result,
        row => _.pick(row, _.map(fields, 'attr'))
      )
      util.$postJSON('/table', data)
        .done(res => {
          window.open(res.link, '_blank')
        })
    }
  }
}
</script>