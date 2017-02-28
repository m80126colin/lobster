import Index from './components/Index'
import Prob  from './components/Prob'
import End   from './components/End'

/**
 *  export routes
 */
export default [
  { path: '/',         component: Index },
  { path: '/prob/:id', component: Prob  },
  { path: '/end',      component: End   }
]