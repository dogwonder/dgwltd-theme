<?php return array(
    'root' => array(
        'name' => 'dgwltd/dgwltd',
        'pretty_version' => 'dev-main',
        'version' => 'dev-main',
        'reference' => '4e111c0040164318a787eb7a2b4f104d756bdfa1',
        'type' => 'wordpress-theme',
        'install_path' => __DIR__ . '/../../',
        'aliases' => array(),
        'dev' => true,
    ),
    'versions' => array(
        'afragen/git-updater-lite' => array(
            'pretty_version' => '1.0.1',
            'version' => '1.0.1.0',
            'reference' => 'bec8ddb0aadd528216674d983f869e7d0a5ae5a3',
            'type' => 'library',
            'install_path' => __DIR__ . '/../afragen/git-updater-lite',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
        'composer/installers' => array(
            'pretty_version' => 'v1.12.0',
            'version' => '1.12.0.0',
            'reference' => 'd20a64ed3c94748397ff5973488761b22f6d3f19',
            'type' => 'composer-plugin',
            'install_path' => __DIR__ . '/./installers',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
        'dgwltd/dgwltd' => array(
            'pretty_version' => 'dev-main',
            'version' => 'dev-main',
            'reference' => '4e111c0040164318a787eb7a2b4f104d756bdfa1',
            'type' => 'wordpress-theme',
            'install_path' => __DIR__ . '/../../',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
        'roundcube/plugin-installer' => array(
            'dev_requirement' => false,
            'replaced' => array(
                0 => '*',
            ),
        ),
        'shama/baton' => array(
            'dev_requirement' => false,
            'replaced' => array(
                0 => '*',
            ),
        ),
    ),
);
