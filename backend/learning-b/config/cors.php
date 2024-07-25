<?php

return [

'paths' => ['api/*'],

'allowed_methods' => ['*'],

'allowed_origins' => ['*','http://localhost:3000'], // ここを適切に設定します。特定のオリジンのみ許可する場合はここを変更。

'allowed_origins_patterns' => [],

'allowed_headers' => ['*'],

'exposed_headers' => [],

'max_age' => 0,

'supports_credentials' => false,

];
