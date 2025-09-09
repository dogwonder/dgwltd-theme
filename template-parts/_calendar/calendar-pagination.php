<nav class="govuk-pagination" role="navigation" aria-label="Calendar navigation">
    <div class="govuk-pagination__prev">
        <a class="govuk-link govuk-pagination__link" href="<?php echo esc_url($prev_url); ?>" rel="prev">
            <svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
            </svg>
            <span class="govuk-pagination__link-title"><?php echo esc_html(date('F Y', mktime(0, 0, 0, $prev_month, 1, $prev_year))); ?></span>
        </a>
    </div>
    
    <ul class="govuk-pagination__list">
        <?php foreach ($year_range as $year) : 
            $is_current = ($year == $current_year);
            $year_url = add_query_arg(['cal_year' => $year, 'cal_month' => ($is_current ? $current_month : 1)], $base_url);
        ?>
            <li class="govuk-pagination__item <?php echo $is_current ? 'govuk-pagination__item--current' : ''; ?>">
                <?php if ($is_current) : ?>
                    <span class="govuk-pagination__link" aria-current="page"><?php echo esc_html($year); ?></span>
                <?php else : ?>
                    <a class="govuk-link govuk-pagination__link" href="<?php echo esc_url($year_url); ?>"><?php echo esc_html($year); ?></a>
                <?php endif; ?>
            </li>
        <?php endforeach; ?>
    </ul>

    <div class="govuk-pagination__next">
        <a class="govuk-link govuk-pagination__link" href="<?php echo esc_url($next_url); ?>" rel="next">
            <span class="govuk-pagination__link-title"><?php echo esc_html(date('F Y', mktime(0, 0, 0, $next_month, 1, $next_year))); ?></span>
            <svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
            </svg>
        </a>
    </div>
</nav>