<template>
<div id="end" class="ui basic segment">
  <table class="ui definition celled table">
    <thead><tr>
      <th></th>
      <th>結果</th>
      <th>選擇</th>
      <th>答案</th>
      <th>開始時間</th>
      <th>結束時間</th>
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
        <td>{{ row.select }}</td>
        <td>{{ row.answer }}</td>
        <td>{{ row.start }}</td>
        <td>{{ row.end }}</td>
      </tr>
    </tbody>
  </table>
  <div class="ui basic center aligned segment">
    <router-link to="/" class="ui blue button">結束</router-link>
  </div>
</div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'end',
  props: [ 'store' ],
  data() {
    return {}
  },
  /**
   *  Emit 'upload_answer' event
   */
  created() {
    this.$root.$emit('upload_answer')
  }
}
</script>