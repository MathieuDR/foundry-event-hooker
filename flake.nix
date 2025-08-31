{
  description = "Foundry Event Hooker - FoundryVTT Module Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          # Core development tools
          nodejs_22
          nodePackages.npm

          # JSON validation and formatting
          jq

          # File watching and development
          nodePackages.nodemon

          # Code formatting and linting
          nodePackages.prettier
          nodePackages.eslint

          # HTTP testing tools
          curl
          httpie

          # Git tools
          git

          # Text processing
          ripgrep
          fd

          # Archive tools for module packaging
          zip
          unzip
        ];

        # Environment variables
        FOUNDRY_MODULE_ID = "foundry-event-hooker";
        NODE_ENV = "development";
      };
    });
}
