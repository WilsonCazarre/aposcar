import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--ignore-certificate-error')
options.add_argument('--ignore-ssl-errors')
options.add_argument('--allow-insecure-localhost')
options.add_argument('--disable-web-security')
options.add_argument('--start-maximized')
options.add_argument('log-level=3')
options.add_experimental_option("prefs", {
    "download.prompt_for_download": False,
    "plugins.always_open_pdf_externally": True,
    "download.default_directory": "./downloads",
    "directory_upgrade": True,
    "safebrowsing.enabled": True,
    "network": "enable"
})

driver = webdriver.Chrome(options=options)

base_url = 'https://letterboxd.com/awards/list/2024-oscars-all-nominated-films/'
driver.get(base_url)

ul_element = WebDriverWait(driver, 20).until(
    EC.presence_of_element_located(
        (By.XPATH, '//ul[contains(@class, "film-list")]'))
)

print("Ul element found")

time.sleep(2)
li_elements = ul_element.find_elements(By.TAG_NAME, 'li')

print(f'{len(li_elements)} <li> elements found')

hrefs = []

for li in li_elements:
    try:
        a_tag = li.find_element(By.TAG_NAME, 'a')
        href = a_tag.get_attribute('href')
        hrefs.append(href)
    except Exception as e:
        print(f'Error finding <a> tag in element: {e}')

print(f'{len(hrefs)} hrefs found')


def navigate_to_url(driver, url, retries=3):
    for attempt in range(retries):
        try:
            driver.get(url)
            print(f'Navigated to {url} successfully')
            return
        except Exception as e:
            print(f'Error navigating to {url}: {e}')
            if attempt < retries - 1:
                print('Retrying...')
                time.sleep(2)
            else:
                raise


movies = []
for href in hrefs:
    time.sleep(5)
    navigate_to_url(driver, href)

    review = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located(
            (By.XPATH, '//div[contains(@class, "review")]'))
    )

    try:
        tagline = review.find_element(
            By.XPATH, '//h4[contains(@class, "tagline")]').text
        print(f'Tagline: {tagline}')
    except Exception as e:
        print(f'Error finding tagline: {e}')
        tagline = None

    description = review.find_element(By.XPATH, '//div/p').text
    print(f'Description: {description}')

    title = driver.find_element(
        By.XPATH, '//h1[contains(@class, "filmtitle")]/span').text
    print(f'Title: {title}')

    try:
        poster = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located(
                (By.XPATH, '//section[contains(@class, "poster-list")]'))
        )
        print(poster.get_attribute('outerHTML'))

        poster_url = poster.find_element(
            By.TAG_NAME, 'a').get_attribute('href')
        print(f'Poster URL: {poster_url}')
    except Exception as e:
        print(f'Error finding poster URL: {e}')
        poster_url = None

    backdrop = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.ID, 'backdrop'))
    )
    backdrop_url = backdrop.get_attribute('data-backdrop')
    print(f'Backdrop URL: {backdrop_url}')

    slug = backdrop.get_attribute('data-film-slug')
    print(f'Slug: {slug}')

    movies.append({
        'title': title,
        'tagline': tagline,
        'description': description,
        'poster_url': poster_url,
        'backdrop_url': backdrop_url,
        'slug': slug,
        'letterboxd_url': href,
        'type': 'movie',
    })

print(f'{len(movies)} movies found\n\n')
print(movies)

with open('json/movies.json', 'w') as f:
    json.dump(movies, f)

driver.quit()
