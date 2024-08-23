namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        // CSRF検証を除外したいURIをここに追加します。
        'learning_user/*',
        'records/*',
        'records/{id}',
        '*'
    ];
}
