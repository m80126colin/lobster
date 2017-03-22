<template>
<div id="admin" class="ui center aligned basic segment">
<div class="ui basic segment">
  <div class="ui secondary menu">
    <a class="item" @click.prevent="state = 'options'">修改選項</a>
    <a class="item" @click.prevent="state = 'problems'">修改題目</a>
    <router-link to="/" class="item">回首頁</router-link>
  </div>
</div>
<div class="ui basic segment" v-show="state === 'options'">
  <div class="ui form">
    <div class="inline fields">
    <div class="field">
      <label for="option">選項</label>
      <input id="option" type="text" name="option" />
    </div>
    <div class="field">
      <button class="ui green button"
        @click.prevent="addOption">新增選項</button>
    </div>
    </div>
  </div>
  <table class="ui definition celled table">
    <thead><tr>
      <th></th>
      <th>選項</th>
      <th>操作</th>
    </tr></thead>
    <tbody>
      <tr v-for="(o, idx) in store.options" :key="`opt${idx}`">
        <td>{{ idx + 1 }}</td>
        <td>{{ o }}</td>
        <td>
          <button class="ui basic red button"
            @click="deleteOption"
            :data-id="idx">刪除</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<div class="ui basic segment" v-show="state === 'problems'">
  <form id="form" class="ui form" method="post" enctype="multipart/form-data">
  <div class="inline fields">
    <div class="field">
      <label for="source">圖片檔案</label>
      <input type="file" name="source" />
    </div>
    <div class="field">
      <label for="answer">答案</label>
      <select name="answer" class="ui search dropdown">
        <option v-for="o in store.options" :value="o">{{ o }}</option>
      </select>
    </div>
    <div class="field">
      <button class="ui green button"
        @click.prevent="addProblem">新增題目</button>
    </div>
  </div>
  </form>
  <table class="ui definition celled table">
    <thead><tr>
      <th></th>
      <th>圖片</th>
      <th>答案</th>
      <th>操作</th>
    </tr></thead>
    <tbody>
      <tr v-for="(row, idx) in store.problems" :key="`prob${idx}`">
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
</div>
<div class="ui basic segment">
  <router-link to="/" class="ui blue button">回首頁</router-link>
</div>
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
      store: {
        options:  [],
        problems: []
      },
      fields: fields,
      state: 'options'
    }
  },
  created() {
    const app = this
    $.getJSON('/list', data => {
      _.assign(app.$data, { store: data })
    })
  },
  watch: {
    store: {
      handler(newStore) {
        window.console.log(newStore)
        util.$postJSON('/list', newStore)
      },
      deep: true
    }
  },
  methods: {
    deleteOption(e) {
      const options = this.store.options
      const idx     = $(e.target).attr('data-id')
      options.splice(idx, 1)
    },
    addOption(e) {
      const options = this.store.options
      const option  = $('#option').val()
      options.push(option)
    },
    deleteProblem(e) {
      const problems = this.store.problems
      const idx      = $(e.target).attr('data-id')
      problems.splice(idx, 1)
    },
    addProblem(e) {
      const problems = this.store.problems
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
        problems.push(data)
      })
    }
  }
}
</script>