import type { ApiLogRecord } from "./types"

// 26 exact API Log records matching screenshots
export const INITIAL_API_LOGS: ApiLogRecord[] = [
  {
    id: "log_01",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7676,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-25 11:55:25",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "You my health be released in the name of Jesus",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_3deeccdfe8f944f2",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_02",
    status: 400,
    method: "POST",
    path: "/api/v1/messages",
    duration: 2161,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-25 11:54:41",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "invalid_num",
        body: "Test payload",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: false,
        error: "INVALID_DESTINATION_MSISDN",
        message: "Destination MSISDN format is invalid.",
      },
      null,
      2
    ),
    errorReason: "INVALID_DESTINATION_MSISDN",
  },
  {
    id: "log_03",
    status: 400,
    method: "POST",
    path: "/api/v1/messages",
    duration: 2071,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-24 14:15:40",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "",
        body: "Missing destination test",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: false,
        error: "MISSING_REQUIRED_FIELD",
        message: "Field 'to' is required.",
      },
      null,
      2
    ),
    errorReason: "MISSING_REQUIRED_FIELD",
  },
  {
    id: "log_04",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7417,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-24 13:28:49",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Account security notification",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_5c10ee3518774ad7",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_05",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7864,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-24 13:17:15",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Your verification code is 849102",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_a2c621cb0ce14480",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_06",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7440,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-23 01:04:23",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Invoice payment confirmed",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_5c6bc185992b4ed9",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_07",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7386,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-23 00:21:53",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "System test notification 01",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_98f608ceca5143ae",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_08",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7462,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-23 00:21:31",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Scheduled event notice",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_00621478c58b4590",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_09",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7359,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 11:55:37",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Reminder notice",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_ec70f5f3770d41aa",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_10",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7405,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 11:55:27",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Statement generated",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_fa3901bce20149bb",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_11",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7456,
    tenant: "Pave360",
    apiKey: "pk_live_1800...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 11:55:11",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Authentication token alert",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_29b8cc9911e403af",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_12",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7455,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 11:39:23",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Account security check",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_5b3ff57222444b2e",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_13",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7456,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 11:37:37",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Verification alert code",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_bed605ce720348d7",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_14",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7530,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 11:19:44",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Payment confirmation",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_b32535b7beab4422",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_15",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7538,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 11:17:16",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Notice of dispatch",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_193ed621719047e3",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_16",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7501,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 10:33:35",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Security token renewal",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_ee78e0315b9e40ac",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_17",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7541,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 00:05:20",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Automated alert",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_77c19a9ef1204c31",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_18",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7546,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-22 00:02:45",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "System dispatch code",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_89f02cde4b1a4592",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_19",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7545,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-21 23:57:29",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Monthly statement notice",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_44e8bc12a9de4011",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_20",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7750,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-21 23:55:05",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Direct balance update",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_31bca092f61e47aa",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_21",
    status: 400,
    method: "POST",
    path: "/api/v1/messages",
    duration: 2866,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-21 23:52:42",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "123",
        body: "Malformed recipient number",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: false,
        error: "INVALID_PHONE_NUMBER",
        message: "Phone number too short.",
      },
      null,
      2
    ),
    errorReason: "INVALID_PHONE_NUMBER",
  },
  {
    id: "log_22",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7520,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-21 20:13:55",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Batch ping alert",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_59f1ca92e01b44c8",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_23",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7510,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-21 16:41:38",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Security ping confirmed",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_12a7bf89d31c4e90",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_24",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7490,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-21 12:09:50",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Network dispatch",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_66db89e02c114f77",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_25",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7480,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-20 18:29:45",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "System update ping",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_88fc0129ad4148b2",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
  {
    id: "log_26",
    status: 202,
    method: "POST",
    path: "/api/v1/messages",
    duration: 7470,
    tenant: "Pave360",
    apiKey: "pk_live_6e7e...",
    clientIp: "::ffff:172.18.0.1",
    timestamp: "2026-09-20 14:14:55",
    userAgent: "PostmanRuntime/2.6.0",
    requestBody: JSON.stringify(
      {
        from: "Pave360",
        to: "0248985021",
        body: "Batch verification 26",
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        messageId: "msg_90e7f12a8b944c66",
        status: "Accepted",
        segments: 1,
      },
      null,
      2
    ),
  },
]
