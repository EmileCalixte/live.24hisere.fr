import React from "react"

class LoadingCategoriesOption extends React.Component {
    static MIN_DOTS = 0;
    static MAX_DOTS = 3;

    constructor(props) {
        super(props);

        this.state = {
            dotCount: LoadingCategoriesOption.MAX_DOTS,
        }
    }

    dotsInterval = null;

    componentDidMount() {
        this.dotsInterval = setInterval(() => {
            if (this.state.dotCount >= LoadingCategoriesOption.MAX_DOTS) {
                this.setState({
                    dotCount: LoadingCategoriesOption.MIN_DOTS,
                });
                return;
            }

            this.setState({
                dotCount: this.state.dotCount + 1,
            })
        }, 200);
    }

    render = () => {
        return (
            <option disabled>
                Chargement des catégories{this.getDots()}
            </option>
        );
    }

    getDots = () => {
        let dots = [];

        for(let i = 0; i < this.state.dotCount; ++i) {
            dots.push('.');
        }

        return dots.join('');
    }

    componentWillUnmount() {
        clearInterval(this.dotsInterval);
    }
}

export default LoadingCategoriesOption
