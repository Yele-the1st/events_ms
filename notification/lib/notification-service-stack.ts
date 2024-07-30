import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class NotificationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // email queue

    // sms queue

    // topic -> user_email, user_otp

    // email handler
    // otp handeler

    // add subscription
  }
}
