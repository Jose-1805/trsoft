@component('mail::message')
# {{__('messages.subject_verification_code')}}

{{__('messages.verification_code_msg_register', ['code' => $user->verification_code])}}

{{__('messages.thanks')}},<br>
{{ config('app.name') }}
@endcomponent
