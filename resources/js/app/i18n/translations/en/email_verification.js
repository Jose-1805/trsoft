export default {
	title:'Email verification',
	msg:'A message has been sent to your email with a 6-digit verification code, the code sent expires in 15 minutes, you must enter it below to validate your email account. If it takes more than 8 minutes click the link located under the Submit button. Our domain name has not yet been enabled by our provider, for this reason our emails can reach your spam tray.',
	verification_code_label:'Verification code',
	verification_code_placeholder:'Enter verification code',
	errors:{
		verification_code_invalid:'The verification code sent is incorrect.',
		verification_code_expired:'Verification code has expired, click "Resend Verification Code" to get a new one.',
		verification_code_null:'SYour user account does not have an associated verification code, click "Resend verification code" to get a new one.',
		invalid_data:'The data sent is incorrect.',
	},
	resend_code:'Resend verification code',
	sending:'Sending new verification code',
	resend_msg:'A new verification code has been sent to your email account.'
}