{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach ($sitemaps as $url => $changed)
  <sitemap><loc>{{ $url }}</loc>@if ($changed)<lastmod>{{ $changed->toAtomString() }}</lastmod>@endif</sitemap>
@endforeach
</sitemapindex>
