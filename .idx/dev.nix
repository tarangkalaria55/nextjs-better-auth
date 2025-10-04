{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_22
  ];
  idx.extensions = [
    "biomejs.biome"
		"mikestead.dotenv"
		"dsznajder.es7-react-js-snippets"
		"YoavBls.pretty-ts-errors"
		"bradlc.vscode-tailwindcss"
		"johnpapa.vscode-peacock"
		"christian-kohler.path-intellisense"
		"aaron-bond.better-comments"
		"steoates.autoimport"
		"formulahendry.auto-complete-tag"
		"mhutchie.git-graph"
		"christian-kohler.npm-intellisense"
		"ms-vscode.vscode-typescript-next"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}
