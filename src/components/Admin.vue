<template>
<div id="admin" class="ui basic center aligned segment">
  <form id="form" class="ui form" method="post" enctype="multipart/form-data">
    <div class="inline field">
      <label for="source">圖片檔案</label>
      <input type="file" name="source" />
    </div>
    <div class="inline field">
      <label for="answer">答案</label>
      <input type="text" name="answer" />
    </div>
    <div class="field">
      <button class="ui green button"
        @click.prevent="addProblem">新增題目</button>
    </div>
  </form>
  <router-link to="/" class="ui blue button">回首頁</router-link>
  <table class="ui definition celled table">
    <thead><tr>
      <th></th>
      <th>圖片</th>
      <th>答案</th>
      <th>操作</th>
    </tr></thead>
    <tbody>
      <tr v-for="(row, idx) in store" :key="idx">
        <td>{{ idx + 1 }}</td>
        <td>
        <a :href="`/static/${row.source}`" target="_blank" class="ui rounded image">
          <img :src="`/static/${row.source}`" class="ui large image" />
        </a>
        </td>
        <td>{{ row.answer }}</td>
        <td>
          <button class="ui basic red button"
            @click="deleteProblem"
            :data-id="idx">刪除</button>
        </td>
      </tr>
    </tbody>
  </table>
  <router-link to="/" class="ui blue button">回首頁</router-link>
</div>
</template>

<script>
import _    from 'lodash'
import $    from 'jquery'
import util from '../scripts/util'

const fields = [
  { name: '答案', attr: 'answer' }
]

export default {
  name: 'admin',
  data() {
    return {
      store:  [],
      fields: fields
    }
  },
  created() {
    const app = this
    $.getJSON('/list', data => {
      _.assign(app.$data, { store: data })
    })
  },
  watch: {
    store(newStore) {
      window.console.log(newStore)
      util.$postJSON('/list', newStore)
    }
  },
  methods: {
    deleteProblem(e) {
      const app = this
      const idx = $(e.target).attr('data-id')
      app.store.splice(idx, 1)
    },
    addProblem(e) {
      const app      = this
      const formData = new FormData( $('#form')[0] )

      $.ajax({
        type:        'POST',
        url:         '/upload',
        data:        formData,
        processData: false,
        contentType: false,
      })
      .done(data => {
        window.console.log(data)
        app.store.push(data)
      })
    }
  }
}
</script>