import { STATUS_META } from '../constants/tracking'

// core-api supports two milestone paths depending on order type — a
// warehouse/hub flow (items-expected, items-received) and a direct-collection
// flow (order-received, driver-on-the-way-to-pickup, driver-arrived-at-first-pickup).
// Rather than assume one, the timeline is built from whichever milestones a
// given delivery actually has, chronologically, with the two universal final
// legs always shown (pending if not yet reached).
const ALWAYS_SHOWN_STEPS = ['out-for-delivery', 'delivered']

// Translates core-api's DeliveryResource shape (see
// app/CustomClasses/Orders/Tracking/DeliveryTracker.php::toArray in core-api)
// into the flat view-model this app's components consume, so a Core API
// contract change only needs updating here.
export function mapDeliveryResponse(response) {
  const delivery = response.data
  const milestones = delivery.milestones ?? {}
  const deliveredMilestone = milestones.delivered
  const pod = deliveredMilestone?.proof_of_delivery

  return {
    code: delivery.tracking_code,
    status: delivery.status,
    timeZone: delivery.time_zone ?? null,
    sender: {
      name: delivery.sender_details?.company_name ?? null,
      logoUrl: delivery.sender_details?.logo_url ?? null,
    },
    deliveredAt: deliveredMilestone?.datetime ?? null,
    address: mapAddress(delivery.recipient_address),
    proofOfDelivery: pod
      ? {
          photoUrl: pod.photo ?? null,
          location: pod.coordinates
            ? { lat: pod.coordinates.latitude, lng: pod.coordinates.longitude }
            : null,
        }
      : null,
    courier: mapCourier(delivery.driver),
    timeline: mapTimeline(milestones),
    existingReview: mapReview(delivery.review),
  }
}

function mapReview(review) {
  if (!review) return null

  return {
    rating: review.rating,
    message: review.message,
    reviewerName: review.reviewer_name,
  }
}

function mapAddress(address) {
  if (!address) return null

  return {
    lines: [address.address_line_1, address.address_line_2, address.city].filter(Boolean),
    postcode: address.postcode,
  }
}

function mapCourier(driver) {
  const details = driver?.details
  if (!details) return null

  return {
    name: details.full_name,
    photoUrl: details.has_uploaded_profile_image ? details.profile_image : null,
    deliveries: details.total_deliveries,
    rating: details.average_rating ?? 0,
  }
}

function mapTimeline(milestones) {
  const presentKeys = Object.keys(milestones).sort((a, b) => {
    const aTime = milestones[a]?.datetime
    const bTime = milestones[b]?.datetime
    if (!aTime) return 1
    if (!bTime) return -1
    return new Date(aTime.replace(' ', 'T')) - new Date(bTime.replace(' ', 'T'))
  })

  const orderedKeys = [...presentKeys]
  for (const key of ALWAYS_SHOWN_STEPS) {
    if (!orderedKeys.includes(key)) orderedKeys.push(key)
  }

  return orderedKeys.map((key) => {
    const milestone = milestones[key]
    const meta = STATUS_META[key] ?? STATUS_META['status-unknown']

    return {
      key,
      label: meta.title,
      description: meta.description,
      timestamp: milestone?.datetime ?? null,
      completed: Boolean(milestone?.datetime),
    }
  })
}
