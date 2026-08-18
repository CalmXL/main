import mitt from 'mitt'

type Events = {
  'change-micro-router': string
  'open-user-info-dialog': void
}
const bus = mitt<Events>()

export default bus
