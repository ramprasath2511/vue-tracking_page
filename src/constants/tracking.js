// Status keys match Delivery::STATUS_* constants in core-api (app/Models/Delivery.php).
export const STATUS_META = {
  'items-expected': {
    title: 'Awaiting your items',
    description: "We're waiting to receive your items so that we can begin processing them for delivery.",
  },
  'items-received': {
    title: 'Received your items',
    description: "We've received your items and have begun processing them for delivery.",
  },
  'order-received': {
    title: 'Order received',
    description: 'Your order has been received and is being prepared.',
  },
  'driver-on-the-way-to-pickup': {
    title: 'Driver on the way to collect',
    description: 'Your driver is on the way to collect your items.',
  },
  'driver-arrived-at-first-pickup': {
    title: 'Driver arrived for collection',
    description: 'Your driver has arrived to collect your items.',
  },
  'out-for-delivery': {
    title: 'Out for delivery',
    description: 'Your driver has started making deliveries.',
  },
  delivered: {
    title: 'Delivered',
    description: "We've successfully delivered your items.",
  },
  'delivery-partially-successful': {
    title: 'Partially delivered',
    description: "Some of your items were delivered. We're resolving the rest.",
  },
  'delivery-attempted': {
    title: 'Delivery attempted',
    description: 'We attempted to deliver your items but were unable to complete it.',
  },
  'delivery-unsuccessful': {
    title: 'Delivery unsuccessful',
    description: "We weren't able to deliver your items.",
  },
  'status-unknown': {
    title: 'Status unknown',
    description: "We don't have an update on your delivery status right now.",
  },
}

// Statuses at which a customer can rate their driver, per manager sign-off.
// 'completed' is actually an Order-level status in core-api rather than a
// Delivery one, so it likely never appears here — included anyway in case
// that assumption is wrong.
export const REVIEWABLE_STATUSES = ['delivered', 'delivery-partially-successful', 'completed']
