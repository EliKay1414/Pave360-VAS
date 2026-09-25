import type { ApiEndpoint } from "./types"

export const API_BASE_URL = "https://vas.pave360.com/api/v1"

export const API_ENDPOINTS: ApiEndpoint[] = [
  // 1. MESSAGES
  {
    id: "post-messages",
    method: "POST",
    path: "/api/v1/messages",
    tag: "Messages",
    summary: "Send an outbound SMS message",
    description:
      "Submit a single or multi-segment SMS message to be delivered via the optimal carrier route. Requires an active API key with messages.send scope.",
    parameters: [
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Cryptographic API key assigned to the tenant account.",
        example: "pk_live_1800cb88...",
      },
      {
        name: "Content-Type",
        in: "header",
        required: true,
        type: "string",
        description: "Format of the request body.",
        example: "application/json",
      },
    ],
    requestBodyExample: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Your verification code is 849102",
        callbackUrl: "https://example.com/webhooks/dlr",
      },
      null,
      2
    ),
    responses: [
      {
        status: 202,
        description: "Accepted for carrier dispatch",
        exampleBody: JSON.stringify(
          {
            success: true,
            messageId: "msg_3deeccdfe8f944f2",
            status: "Accepted",
            segments: 1,
            rate: "0.0400 GHS",
            timestamp: "2026-09-25T11:55:25Z",
          },
          null,
          2
        ),
      },
      {
        status: 400,
        description: "Bad Request (e.g. invalid MSISDN or missing parameters)",
        exampleBody: JSON.stringify(
          {
            success: false,
            error: "INVALID_DESTINATION_MSISDN",
            message: "Destination MSISDN format is invalid.",
          },
          null,
          2
        ),
      },
      {
        status: 401,
        description: "Unauthorized (invalid or revoked API key)",
        exampleBody: JSON.stringify(
          {
            success: false,
            error: "UNAUTHORIZED",
            message: "Missing or invalid X-Api-Key header.",
          },
          null,
          2
        ),
      },
    ],
  },
  {
    id: "get-messages-id",
    method: "GET",
    path: "/api/v1/messages/{id}",
    tag: "Messages",
    summary: "Retrieve message delivery status and telemetry",
    description:
      "Get real-time carrier delivery receipt (DLR), latency, segmentation count, and billing charge for a specific message.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        type: "string",
        description: "Unique message identifier (e.g. msg_3deeccdfe8f944f2).",
        example: "msg_3deeccdfe8f944f2",
      },
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    responses: [
      {
        status: 200,
        description: "Message details retrieved",
        exampleBody: JSON.stringify(
          {
            id: "msg_3deeccdfe8f944f2",
            status: "Delivered",
            from: "Pave360",
            to: "233248985021",
            carrier: "AT Ghana SMSC",
            carrierMsgId: "2078720061",
            segments: 1,
            cost: "0.0400 GHS",
            deliveredAt: "2026-09-25T11:55:30Z",
          },
          null,
          2
        ),
      },
      {
        status: 404,
        description: "Message not found",
        exampleBody: JSON.stringify(
          {
            success: false,
            error: "MESSAGE_NOT_FOUND",
            message: "Message with ID msg_3deeccdfe8f944f2 was not found.",
          },
          null,
          2
        ),
      },
    ],
  },
  {
    id: "delete-messages-id",
    method: "DELETE",
    path: "/api/v1/messages/{id}",
    tag: "Messages",
    summary: "Cancel a scheduled or queued message",
    description:
      "Cancels an un-dispatched message that is in Queued status, releasing the reserved wallet balance immediately.",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        type: "string",
        description: "Unique message identifier.",
        example: "msg_4497cd22ef990011",
      },
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    responses: [
      {
        status: 200,
        description: "Message successfully cancelled",
        exampleBody: JSON.stringify(
          {
            success: true,
            messageId: "msg_4497cd22ef990011",
            status: "Cancelled",
            refundedAmount: "0.0400 GHS",
          },
          null,
          2
        ),
      },
    ],
  },

  // 2. INBOUND MO
  {
    id: "get-inbound",
    method: "GET",
    path: "/api/v1/inbound",
    tag: "Inbound MO",
    summary: "Query mobile-originated (MO) inbound messages",
    description:
      "Fetch inbound replies sent by handsets to your shortcodes or long numbers.",
    parameters: [
      {
        name: "limit",
        in: "query",
        required: false,
        type: "integer",
        description: "Number of records to retrieve (default: 50, max: 200).",
        example: "50",
      },
      {
        name: "since",
        in: "query",
        required: false,
        type: "string",
        description: "UTC ISO timestamp to query messages received after.",
        example: "2026-09-24T00:00:00Z",
      },
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    responses: [
      {
        status: 200,
        description: "List of inbound messages",
        exampleBody: JSON.stringify(
          {
            count: 1,
            items: [
              {
                id: "inb_8912ba00fe11",
                from: "233248985021",
                to: "3600",
                message: "YES",
                carrier: "AT Ghana SMSC",
                receivedAt: "2026-09-25T10:14:02Z",
              },
            ],
          },
          null,
          2
        ),
      },
    ],
  },

  // 3. USSD
  {
    id: "post-ussd-session",
    method: "POST",
    path: "/api/v1/ussd/session",
    tag: "USSD",
    summary: "Initiate or respond to an interactive USSD session",
    description:
      "Handle USSD menu interactions with end-users on GSM networks (*384# shortcodes).",
    parameters: [
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    requestBodyExample: JSON.stringify(
      {
        sessionId: "ussd_77189fa102",
        msisdn: "233248985021",
        serviceCode: "*384#",
        ussdString: "1",
        type: "continue",
      },
      null,
      2
    ),
    responses: [
      {
        status: 200,
        description: "USSD response menu returned",
        exampleBody: JSON.stringify(
          {
            sessionId: "ussd_77189fa102",
            type: "continue",
            message: "Select Service:\n1. Check Account\n2. Buy Airtime\n3. Exit",
          },
          null,
          2
        ),
      },
    ],
  },
  {
    id: "post-ussd-notify",
    method: "POST",
    path: "/api/v1/ussd/notify",
    tag: "USSD",
    summary: "Send a network-initiated USSD push alert",
    description:
      "Pushes a single-turn flash notification display directly onto the handset screen.",
    parameters: [
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    requestBodyExample: JSON.stringify(
      {
        msisdn: "233248985021",
        message: "Payment of 50.00 GHS received. Ref: TXN99102",
      },
      null,
      2
    ),
    responses: [
      {
        status: 200,
        description: "USSD push dispatched",
        exampleBody: JSON.stringify(
          {
            success: true,
            status: "Delivered",
            cost: "0.0200 GHS",
          },
          null,
          2
        ),
      },
    ],
  },

  // 4. SENDER IDS
  {
    id: "get-senders",
    method: "GET",
    path: "/api/v1/senders",
    tag: "Sender IDs",
    summary: "List approved Sender IDs for the tenant",
    description:
      "Returns all registered alphanumeric or shortcode Sender IDs approved for outbound SMS messaging.",
    parameters: [
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    responses: [
      {
        status: 200,
        description: "List of approved Sender IDs",
        exampleBody: JSON.stringify(
          {
            senders: [
              {
                id: "snd_01",
                senderId: "Pave360",
                type: "Alphanumeric",
                status: "Approved",
                carriers: ["AT-GH", "MTN-GH", "TEL-GH"],
              },
              {
                id: "snd_02",
                senderId: "PAYMENT",
                type: "Alphanumeric",
                status: "Approved",
                carriers: ["AT-GH"],
              },
            ],
          },
          null,
          2
        ),
      },
    ],
  },
  {
    id: "post-senders",
    method: "POST",
    path: "/api/v1/senders",
    tag: "Sender IDs",
    summary: "Request registration of a new Sender ID",
    description:
      "Submit a regulatory registration request to mobile network operators for brand identification.",
    parameters: [
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    requestBodyExample: JSON.stringify(
      {
        senderId: "MYBRAND",
        purpose: "Transactional OTP and account alerts",
        documentUrl: "https://example.com/company_cert.pdf",
      },
      null,
      2
    ),
    responses: [
      {
        status: 201,
        description: "Sender ID registration request submitted",
        exampleBody: JSON.stringify(
          {
            success: true,
            senderId: "MYBRAND",
            status: "Pending Carrier Review",
          },
          null,
          2
        ),
      },
    ],
  },

  // 5. WEBHOOKS
  {
    id: "get-webhooks",
    method: "GET",
    path: "/api/v1/webhooks",
    tag: "Webhooks",
    summary: "List registered webhook endpoints",
    description:
      "Returns all configured outbound callback URLs for delivery receipts and inbound events.",
    parameters: [
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    responses: [
      {
        status: 200,
        description: "Configured webhooks list",
        exampleBody: JSON.stringify(
          {
            webhooks: [
              {
                id: "wh_01",
                name: "Delivery Callbacks",
                url: "https://api.example.com/webhooks/dlr",
                event: "DeliveryReport",
                status: "Active",
                failures: 0,
              },
            ],
          },
          null,
          2
        ),
      },
    ],
  },
  {
    id: "post-webhooks",
    method: "POST",
    path: "/api/v1/webhooks",
    tag: "Webhooks",
    summary: "Register a new webhook subscription",
    description:
      "Add an HTTPS endpoint to receive signed JSON payloads upon delivery receipt or handset reply.",
    parameters: [
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    requestBodyExample: JSON.stringify(
      {
        name: "Delivery Callbacks",
        url: "https://api.example.com/webhooks/dlr",
        event: "DeliveryReport",
        secret: "whsec_custom_secret_key_889102",
        maxAttempts: 5,
        timeoutSeconds: 10,
        enabled: true,
      },
      null,
      2
    ),
    responses: [
      {
        status: 201,
        description: "Webhook created successfully",
        exampleBody: JSON.stringify(
          {
            success: true,
            id: "wh_9812bf10",
            status: "Active",
          },
          null,
          2
        ),
      },
    ],
  },

  // 6. ACCOUNT & BILLING
  {
    id: "get-account-balance",
    method: "GET",
    path: "/api/v1/account/balance",
    tag: "Account",
    summary: "Check wallet balance, credit limits, and rate limit quotas",
    description:
      "Returns tenant financial balances (prepaid wallet, postpaid accrued, in-flight reserve) and rate limit allocations.",
    parameters: [
      {
        name: "X-Api-Key",
        in: "header",
        required: true,
        type: "string",
        description: "Tenant API key.",
        example: "pk_live_1800cb88...",
      },
    ],
    responses: [
      {
        status: 200,
        description: "Account balance retrieved",
        exampleBody: JSON.stringify(
          {
            tenant: "Pave360",
            currency: "GHS",
            prepaidBalance: 999.32,
            inFlightReserved: 0.92,
            postpaidAccrued: 0.0,
            rateLimitTps: 500,
            status: "Active",
          },
          null,
          2
        ),
      },
    ],
  },
]
