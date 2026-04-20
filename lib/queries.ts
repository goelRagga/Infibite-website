import gql from 'graphql-tag';

export const GET_PROPERTIES_DETAILS_LIST = gql`
  query PropertiesRates(
    $filters: PropertiesRatesInput
    $page: Int
    $pageSize: Int
    $sort: SortInput
    $keyword: String
  ) {
    propertiesRatesV1(
      page: $page
      pageSize: $pageSize
      propertiesRatesInput: $filters
      sort: $sort
      keyword: $keyword
    ) {
      list {
        brand
        numberOfOffers
        elfSightClassId
        isNew
        isPrive
        id
        slug
        isHighDemand
        name
        city
        citySlug
        location
        metaTag {
          description
          keywords
          title
        }
        state
        metrics {
          name
          value
        }
        priceAmount
        virtualTourUrl
        googleMapEmbedLink
        spaces {
          title
          url
          description
        }
        topAmenities {
          name
          icon
        }
        guidedVideoTour {
          videoWeb
          videoMobile
          thumbnailWeb
          thumbnailMobile
        }
        nonBrandedGuidedVideoTour {
          videoWeb
          videoMobile
          thumbnailWeb
          thumbnailMobile
        }
        images {
          name
          url
        }
        brandedBrochure
        defaultMedia {
          name
          url
        }
        amenities {
          icon
          name
          category
        }
        isPetFriendly
        securityFee
        review {
          rating
          numberOfReviews
        }
        maxAdults
        maxChildren
        maxOccupancy
        streetLine
        sections {
          content
          title
          url
        }
        faqs {
          category
          list {
            answer
            question
          }
        }
        quotes {
          netPerNightAmountBeforeTax
          originalNetPerNightAmountAfterTax
          originalNetPerNightAmountBeforeTax
          promotionDiscountPercentage
          promotionCode
          netPerNightAmountAfterTax
          promotionDiscountAmount
          platformFeePercentage
        }
      }
      currentPage
      hasNext
      hasPrevious
      pageSize
      pagesCount
      totalElementsCount
    }
  }
`;

export const GET_PROPERTIES_LISTING = gql`
  query PropertiesRatesListing(
    $filters: PropertiesRatesInput
    $page: Int
    $pageSize: Int
    $sort: SortInput
    $keyword: String
  ) {
    propertiesRatesV1(
      page: $page
      pageSize: $pageSize
      propertiesRatesInput: $filters
      sort: $sort
      keyword: $keyword
    ) {
      list {
        id
        slug
        name
        brand
        isPrive
        isHighDemand
        isNew
        isPetFriendly
        city
        citySlug
        location
        state
        maxOccupancy
        metrics {
          name
          value
        }
        priceAmount
        review {
          rating
        }
        topAmenities {
          name
          icon
        }
        images {
          name
          url
        }
        defaultMedia {
          name
          url
        }
        quotes {
          netPerNightAmountBeforeTax
          originalNetPerNightAmountBeforeTax
          bankOfferPercentage
          icon
          shortDescription
        }
      }
      currentPage
      hasNext
      hasPrevious
      pageSize
      pagesCount
      totalElementsCount
    }
  }
`;

export const GET_PROPERTY_FILTERS = gql`
  query getPropertyFilters {
    propertyFilters {
      bhkFilter
      propertyTypeFilter {
        name
        slug
      }
      pricingFilter {
        minPrice
        maxPrice
      }
    }
  }
`;

export const GET_KEY_VALUE = gql`
  query GetKeyValue($key: ID!) {
    keyValue(key: $key)
  }
`;

// Use GET_KEY_VALUE instead
export const GET_HOMEPAGE_CONTENT = GET_KEY_VALUE;

export const GET_AMOUNT_DETAILS = gql`
  query amountReview($filters: PropertiesRatesInput!) {
    propertiesRatesV1(propertiesRatesInput: $filters) {
      list {
        quotes {
          gstAmount
          originalNetAmountBeforeTax
          numberOfNights
          netPerNightAmountBeforeTax
          netAmountAfterTax
          netPerNightAmountAfterTax
          originalNetPerNightAmountAfterTax
          originalNetPerNightAmountBeforeTax
          soldOut
          couponCode
          couponDiscountAmount
          couponDiscountPercentage
          bankOfferCode
          paymentDiscountAmount
          paymentDiscountPercentage
          promotionCode
          promotionDiscountAmount
          promotionDiscountPercentage
          splitPaymentPercentage
          mealCost
          platformFeePercentage
          cancellationPolicies {
            policyId
            policyName
            policyDescription
            messages
        }
        }
      }
    }
  }
`;

export const GET_NEW_PROPERTIES_LIST = gql`
  query PropertiesRates(
    $sortField: String!
    $sortDirection: SortDirection!
    $filters: PropertiesRatesInput
  ) {
    propertiesRatesV1(
      sort: { field: $sortField, direction: $sortDirection }
      propertiesRatesInput: $filters
    ) {
      currentPage
      list {
        brand
        id
        slug
        name
        review {
          rating
          numberOfReviews
        }
        priceAmount
        state
        images {
          name
          url
        }
        topAmenities {
          name
          icon
        }
        city
        citySlug
        location
        metrics {
          name
          value
        }
      }
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query {
    me {
      active
      email
      emailVerified
      externalIdpId
      firstName
      id
      salutation
      lastName
      name
      phone
      picture
      phoneVerified
      username
      profile {
        channelId
        type
      }
      createdAt
      city
      firstLoginIntent
      phoneNumber
      countryCode
    }
  }
`;

export const GET_BOOKINGS_LIST = gql`
  query bookings($bookingStatus: BookingStatus) {
    bookings(input: { bookingStatus: $bookingStatus }) {
      bookingDate
      bookingStatus
      paidAmount
      outstandingAmount
      numberOfGuest
      adults
      children
      numberOfNights
      user {
        name
        phone
        email
      }
      bookingPaymentTerm
      checkinDate
      checkoutDate
      actualPaidAmount
      paymentStatus
      id
      property {
        image
        name
        city
        location
        state
        country
        metrics {
          name
          value
        }
        isPrive
      }
      ratePlanName
      isGroupBooking
      childBookings {
        property {
          image
          name
          city
          location
          state
          country
          metrics {
            name
            value
          }
          isPrive
        }
      }
    }
  }
`;

export const GET_AVAILABILITY_LIST = gql`
  query AvailabilityList(
    $propertyId: String!
    $fromDate: Date!
    $toDate: Date!
  ) {
    inventories(
      input: { propertyId: $propertyId, fromDate: $fromDate, toDate: $toDate }
    ) {
      date
      quantity
      minimumStay
      maximumStay
      checkoutOnly
      stopSell
    }
  }
`;

export const GET_REVIEW_BOOKING_DETAILS = gql`
  query bookingReview($filters: PropertiesRatesInput) {
    propertiesRatesV1(propertiesRatesInput: $filters) {
      list {
        id
        slug
        defaultMedia {
          url
          name
        }
        name
        metrics {
          name
          value
        }
        isPetFriendly
        securityFee
        review {
          rating
          numberOfReviews
        }
        city
        citySlug
        location
        priceAmount
        isPrive
        maxAdults
        maxChildren
        maxOccupancy
        state
        sections {
          content
          title
          url
        }
        faqs {
          category
          list {
            answer
            question
          }
        }
        quotes {
          id
          gstAmount
          checkinDate
          checkoutDate
          adults
          children
          couponCode
          soldOut
          couponDiscountAmount
          couponDiscountPercentage
          bankOfferCode
          paymentDiscountAmount
          paymentDiscountPercentage
          promotionCode
          promotionDiscountAmount
          promotionDiscountPercentage
          netAmountAfterTax
          netAmountBeforeTax
          netVasAmountBeforeTax
          numberOfGuests
          numberOfNights
          splitPaymentAmount
          netPerNightAmountAfterTax
          originalNetPerNightAmountBeforeTax
          originalNetAmountBeforeTax
          platformFeePercentage
          ratePlan {
            id
            code
            description
            displayName
          }
          remainingAmountAfterSplitPayment
          splitPaymentPercentage
          mealCost
          cancellationPlans {
            discountAmount
            messages
            offerType
            offerValue
            ruleDescription
            ruleId
            ruleName
            policy {
              policyId
              policyName
              policyDescription
              messages
              applicableCancellationPolicyRules {
                cancellationFees
                message
                penaltyType
                penaltyValue
                policyRuleId
                refundableType
                tillDate
                tillTime
              }
            }
          }
          cancellationPlan {
            ruleId
            ruleName
            ruleDescription
            offerType
            offerValue
            discountAmount
            messages
          }
          vas {
            id
            basePrice
            code
            description
            price
            quantity
            totalPrice
            image
            name
            gstAmount
            totalPrice
          }
          cancellationPlanInstantDiscountAmount
          cancellationPlanOfferType
          cancellationPlanOfferValue
          cancellationPolicies {
            policyId
            policyName
            policyDescription
            messages
            applicableCancellationPolicyRules {
              cancellationFees
              message
              penaltyType
              penaltyValue
              refundableType
              tillDate
              tillTime
              policyRuleId
            }
          }
        }
      }
    }
  }
`;

export const OUTSTANDING_PAYMENT = gql`
  mutation MyMutation($bookingId: String!) {
    outstandingPayment(bookingId: $bookingId) {
      paymentGatewayCheckoutCode
      id
      paymentGateway
    }
  }
`;

export const CONFIRM_BOOKING_DETAILS = gql`
  query BOOKINGDETAILS($id: ID!) {
    booking(id: $id) {
      actualPaidAmount
      checkinDate
      checkoutDate
      bookingStatus
      bookingDate
      id
      isWalletUsed
      WalletAmountUsed
      amountAfterWalletApply
      splitAmountAfterWalletApply
      rewards {
        code
        description
      }
      numberOfNights
      numberOfGuest
      adults
      children
      outstandingAmount
      property {
        metrics {
          name
          value
        }
        image
        city
        location
        brandedBrochure
        name
        state
        isPrive
      }
      netVasAmountBeforeTax
      valueAddedServices {
        name
        quantity
        image
        netAmountBeforeTax
        quantity
      }
      ratePlanName
      mealCost
      user {
        salutation
        phone
        email
        name
      }
      paymentStatus
        reward {
          amount
        }
    }
  }
`;

export const BOOKING_DETAILS = gql`
  query BOOKINGDETAILS($id: ID!) {
    booking(id: $id) {
      netBookingAmountAfterTax
      netAmountAfterTax
      originalNetAmountBeforeTax
      originalNetPerNightAmountBeforeTax
      platformFeePercentage
      netAmountBeforeTax
      actualPaidAmount
      extraAmount
      gstAmount
      checkinDate
      checkoutDate
      bookingStatus
      bookingDate
      id
      showPrice
      isWalletUsed
      WalletAmountUsed
      amountAfterWalletApply
      splitAmountAfterWalletApply
      rewards {
        code
        description
      }
      numberOfNights
      numberOfGuest
      adults
      children
      outstandingAmount
      property {
        metrics {
          name
          value
        }
        image
        isPrive
        city
        location
        brandedBrochure
        name
        state
        streetLine
        googleMapEmbedLink
      }
      netVasAmountBeforeTax
      valueAddedServices {
        name
        quantity
        image
        netAmountBeforeTax
        quantity
      }
      ratePlanName
      mealCost
      user {
        phone
        salutation
        email
        name
        firstName
        city
      }
      paymentStatus
      couponCode
      bankOfferCode
      promotionCode
      couponDiscountAmount
      paymentDiscountAmount
      promotionDiscountAmount
      cancellationPlan {
        ruleId
        ruleName
        ruleDescription
        offerType
        offerValue
        discountAmount
        messages
      }
      cancellationPlanInstantDiscountAmount
      cancellationPlanOfferType
      cancellationPlanOfferValue
      reward {
        amount
      }
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  query verifyPayment($paymentId: String!) {
    verifyPayment(paymentId: $paymentId) {
      amount
      amountPaid
      bookingId
      status
    }
  }
`;

export const GET_OFFERS = gql`
  query Offers($propertyId: String) {
    offers(input: { propertyId: $propertyId }) {
      code
      description
      endDateTime
      termsAndConditions
      maximumDiscountAllowed
      title
      discountPercentage
      discountMethod
      icon
      minimumNights
    }
  }
`;

export const CREATE_GUEST_RESERVATION_MUTATION = gql`
  mutation CreateGuestReservation(
    $quoteId: ID!
    $reservationInput: GuestReservationInput!
  ) {
    guestReservations(quoteId: $quoteId, reservationInput: $reservationInput) {
      id
      amount
      paymentGatewayCheckoutCode
      status
      paymentGateway
      bookingId
    }
  }
`;

export const GENERATE_OTP = gql`
  query GenerateOtp($phone: String!) {
    passwordless(input: { phone: $phone })
  }
`;

export const CHECK_AUTHENTICATION = gql`
  query Authenticate($code: String, $phone: String, $refreshToken: String) {
    authenticate(
      input: { code: $code, phone: $phone, refreshToken: $refreshToken }
    ) {
      refreshToken
      accessToken
    }
  }
`;

export const GENERATE_OTP_EMAIL = gql`
  query PasswordlessEmail($email: String!) {
    passwordlessEmail(email: $email)
  }
`;

export const CHECK_AUTHENTICATION_EMAIL = gql`
  query AuthenticateEmail($code: String!, $email: String!) {
    authenticateEmail(code: $code, email: $email) {
      accessToken
      refreshToken
    }
  }
`;

export const USER_SIGNUP = gql`
  mutation SignUpUser(
    $id: String!
    $firstName: String!
    $lastName: String!
    $email: String
    $phone: String
    $salutation: String
  ) {
    user(
      input: {
        id: $id
        salutation: $salutation
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
      }
    ) {
      id
      firstName
      lastName
      salutation
      email
      emailVerified
      phone
      phoneVerified
    }
  }
`;

export const RETARGETING_EVENTS = gql`
  mutation Events(
    $name: EventType!
    $sessionId: String!
    $adults: Int
    $children: Int
    $checkinDate: Date
    $checkoutDate: Date
    $email: String
    $guestId: String
    $phone: String
    $propertyId: String
  ) {
    events(
      input: {
        name: $name
        sessionId: $sessionId
        adults: $adults
        children: $children
        checkinDate: $checkinDate
        checkoutDate: $checkoutDate
        email: $email
        guestId: $guestId
        phone: $phone
        propertyId: $propertyId
      }
    ) {
      id
    }
  }
`;
// user city options
export const GET_INDIAN_CITIES_LIST = gql`
  query CityList($keyword: String) {
    cityList(keyword: $keyword) {
      name
    }
  }
`;

export const GET_AVAILABLE_PLANS_FOR_PROPERTY = gql`
  query availablePlans($filters: PropertiesRatesInput) {
    propertiesRatesV1(propertiesRatesInput: $filters) {
      list {
        id
        quotes {
          ratePlan {
            code
            description
            displayName
            id
          }
          gstAmount
          netAmountBeforeTax
          netPerNightAmountBeforeTax
          netPerNightAmountAfterTax
          netPerNightGstAmount
        }
      }
    }
  }
`;
export const COLLECT_PAYMENT_MUTATION = gql`
  mutation CollectPayments(
    $amount: Int
    $bookingId: String!
    $paymentGateway: PaymentGateway!
    $type: PaymentType!
  ) {
    collectPayments(
      input: {
        amount: $amount
        bookingId: $bookingId
        paymentGateway: $paymentGateway
        type: $type
      }
    ) {
      amountPaid
      amount
      bookingId
      errorCode
      errorReason
      errorDescription
      status
      id
      paymentGatewayCheckoutCode
      paymentMethod
      quoteId
      paymentGatewayOrderId
      paymentGatewaySuccessPaymentId
      paymentGatewayOfferAmount
      paymentGatewayOfferId
      paymentGatewayTax
      paymentGateway
      payerId
      errorSource
    }
  }
`;

export const SECURITY_DEPOSIT_DETAILS = gql`
  query SecurityDeposit($bookingId: ID!) {
    securityDeposit(bookingId: $bookingId) {
      originalSecurityDepositAmount
      securityDepositAmount
      securityDepositMode
      securityDepositStatus
      isOwnerBooking
      refund {
        amount
        deductedAmount
        flow
        status
        totalAmount
        deductions {
          total_deduction_amount
          summary {
            cost
            createdAt
            description
            id
            remark
            attachments {
              url
            }
          }
        }
      }
    }
  }
`;

export const REFUND_MUTATION = gql`
  mutation Refund($bookingId: String) {
    refund(input: { bookingId: $bookingId }) {
      amount
      id
      cashgram {
        id
        url
      }
      paymentId
      remarks
      pgRefundId
      status
      typeProcessed
    }
  }
`;

export const GET_VALUE_ADDED_SERVICES = gql`
  query getValueAddedServices($propertyId: String!) {
    propertiesRatesV1(propertiesRatesInput: { propertyId: $propertyId }) {
      list {
        id
        name
        valueAddedServices {
          id
          name
          description
          basePrice
          applicableAdults
          image
          # totalPrice
        }
      }
    }
  }
`;

export const ADD_VAS_TO_QUOTE_MUTATION = gql`
  mutation AddVasToQuote(
    $quoteId: ID!
    $services: [ValueAddedServiceRequest]!
  ) {
    addVasToQuote(quoteId: $quoteId, services: $services) {
      id
      gstAmount
      checkinDate
      checkoutDate
      adults
      children
      couponCode
      couponDiscountAmount
      couponDiscountPercentage
      bankOfferCode
      paymentDiscountAmount
      paymentDiscountPercentage
      promotionCode
      promotionDiscountAmount
      promotionDiscountPercentage
      netAmountAfterTax
      netAmountBeforeTax
      netVasAmountBeforeTax
      numberOfGuests
      numberOfNights
      splitPaymentAmount
      netPerNightAmountAfterTax
      originalNetPerNightAmountBeforeTax
      originalNetAmountBeforeTax
      platformFeePercentage
      ratePlan {
        id
        code
        description
        displayName
      }
      remainingAmountAfterSplitPayment
      splitPaymentPercentage
      mealCost
      isWalletUsed
      WalletAmountUsed
      amountAfterWalletApply
      splitAmountAfterWalletApply
      walletUsedRefId
      cancellationPlans {
        discountAmount
        messages
        offerType
        offerValue
        ruleDescription
        ruleId
        ruleName
        policy {
          policyId
          policyName
          policyDescription
          messages
          applicableCancellationPolicyRules {
            cancellationFees
            message
            penaltyType
            penaltyValue
            policyRuleId
            refundableType
            tillDate
            tillTime
          }
        }
      }
      cancellationPlan {
        ruleId
        ruleName
        ruleDescription
        offerType
        offerValue
        discountAmount
        messages
      }
      cancellationPlanInstantDiscountAmount
      cancellationPlanOfferType
      cancellationPlanOfferValue
      cancellationPolicies {
        policyId
        policyName
        policyDescription
        messages
        applicableCancellationPolicyRules {
          cancellationFees
          message
          penaltyType
          penaltyValue
          refundableType
          tillDate
          tillTime
          policyRuleId
        }
      }
      vas {
        id
        basePrice
        code
        description
        price
        quantity
        totalPrice
        image
        name
        gstAmount
        totalPrice
      }
    }
  }
`;

export const GET_QUOTE_ID = gql`
  query getQuoteId($filters: PropertiesRatesInput) {
    propertiesRatesV1(propertiesRatesInput: $filters) {
      list {
        id
        quotes {
          id
        }
      }
    }
  }
`;

export const GET_LOCATIONS_LIST = gql`
  query GetLocation($keyword: String) {
    getLocations(keyword: $keyword) {
      locationType
      name
      slug
      homepageImageUrl
    }
  }
`;

export const GET_LOCATIONS_CONTENT = gql`
  query LocationContent($slug: String!) {
    locationContent(slug: $slug) {
      content
      description
      homepageImageUrl
      imageUrl
      metaDescription
      metaTitle
      mobileImageUrl
      name
      title
    }
  }
`;

export const GET_DESTINATIONS_LIST = gql`
  query Destinations {
    destinations {
      id
      name
      slug
      metaTitle
      metaDescription
      cities {
        id
        name
        slug
        metaTitle
        metaDescription
        areas {
          id
          name
          slug
          metaTitle
          metaDescription
        }
      }
    }
  }
`;

export const GET_CITY_WITH_DETAILS = gql`
  query Cities {
    cityWithDetails {
      name
      noOfProperties
      homepageImageUrl
      slug
      category
      categoryIcon
    }
  }
`;

export const GET_CITY_PROPERTIES_AND_LOCATION = gql`
  query CityProperties($keyword: String) {
  searchPropertyAndLocation(keyword: $keyword) {
      name
      slug
      propertyId
      propertyCitySlug
      filterType
      locationHomepageImageUrl
    }
  }
`;

export const GET_EVENT_LISTING = gql`
  query PropertiesByTag($tag: ID!, $page: Int!, $pageSize: Int!) {
    propertiesByTag(tag: $tag, page: $page, pageSize: $pageSize) {
      currentPage
      pageSize
      totalElementsCount
      pagesCount
      hasPrevious
      hasNext
      liveListingCount
      list {
        id
        name
        priceAmount
        virtualTourUrl
        location
        city
        state
        country
        maxAdults
        maxChildren
        maxOccupancy
        extraAdultRate
        extraChildRate
        splitPaymentPercentage
        soldOut
        numberOfOffers
        slug
        citySlug
        isNew
        elfSightClassId
        isHighDemand
        isPrive
        type
        brand
        isPetFriendly
        tags
        isSupplyHardfloorBreached
        images {
          name
          url
        }
        topAmenities {
          name
          icon
        }
        metrics {
          name
          value
        }
      }
    }
  }
`;
