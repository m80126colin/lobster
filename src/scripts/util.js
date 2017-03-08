import _ from 'lodash'
import $ from 'jquery'

const postJSON = (url, data) => {
  return $.ajax({
    type:        'POST',
    url:         url,
    contentType: 'application/json',
    data:        JSON.stringify(data)
  })
}

export default {
  $postJSON: postJSON
}